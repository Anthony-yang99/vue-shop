<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="actionIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 左边标签栏 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormrules"
        ref="addGoodsFormRef"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-tabs
          v-model="actionIndex"
          :tab-position="'left'"
          :before-leave="beforeTabsLeave"
          @tab-click="tabClickInfo"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addGoodsForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoodsForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodsForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="{
                  expandTrigger: 'hover',
                  value: 'cat_id',
                  label: 'cat_name',
                  children: 'children'
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染动态参数 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTabData"
              :key="item.attr_id"
            >
              <!-- 多选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTabData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headersObj"
              list-type="picture"
              :on-success="handleSucess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件,且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addbtn" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="imgdialogVisible" width="50%">
      <img class="picPreview" :src="imgUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import _ from 'lodash'
export default {
  name: 'Add-View',
  data() {
    return {
      actionIndex: '0',
      // 添加商品的表单数据对象
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        // 级联选择器选中的项
        goods_cat: [],
        // 上传的图片临时地址
        pics: [],
        // 商品信息
        goods_introduce: '',
        attrs: []
      },
      // 添加商品的规则
      addGoodsFormrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      },
      // 分类数据
      cateList: [],
      // 获取的动态参数
      manyTabData: [],
      // 静态属性
      onlyTabData: [],
      // 图片上传的请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      imgUrl: '',
      // 图片预览的显示与隐藏
      imgdialogVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      // console.log(res)
      this.cateList = res.data
      // console.log(this.cateList)
    },
    // 级联选择器的改变监听事件
    handleChange() {
      if (this.addGoodsForm.goods_cat.length < 3) {
        this.addGoodsForm.goods_cat = []
      }
      console.log(this.addGoodsForm.goods_cat)
    },
    // 锁定标签栏，不选择分类不能点击别的标签栏
    beforeTabsLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length < 3) {
        this.$message.error('请选择三级分类')
        return false
      }
    },
    // tab 被选中时触发
    async tabClickInfo() {
      // console.log(this.actionIndex)
      if (this.actionIndex === '1') {
        // console.log(this.actionIndex)
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.message.error('获取动态参数失败')
        }
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        console.log(res.data)
        this.manyTabData = res.data
      } else if (this.actionIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.message.error('获取静态属性失败')
        }
        this.onlyTabData = res.data
      }
    },
    // 图片的预览事件
    handlePreview(file) {
      // console.log(file)
      this.imgUrl = file.response.data.url
      this.imgdialogVisible = true
    },
    // 图片的删除事件
    handleRemove(file) {
      // console.log(file)
      const filePath = file.response.data.tmp_path
      const index = this.addGoodsForm.pics.findIndex((i) => i.pic === filePath)
      this.addGoodsForm.pics.splice(index, 1)
      console.log(this.addGoodsForm.pics)
    },
    // 图片上传成功的监听函数
    handleSucess(response) {
      // console.log(response)
      const picPath = { pic: response.data.tmp_path }
      this.addGoodsForm.pics.push(picPath)
      console.log(this.addGoodsForm.pics)
    },
    // 添加商品
    add() {
      // eslint-disable-next-line space-before-function-paren
      this.$refs.addGoodsFormRef.validate(async (vali) => {
        if (!vali) {
          this.$message.error('请输入必要的表单项')
        }
        // 添加的业务逻辑
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTabData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTabData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_value
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        form.attrs = this.addGoodsForm.attrs
        // console.log(this.addGoodsForm)
        console.log(form)
        // 发起添加商品请求
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error('添加商品失败')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        console.log(this.addGoodsForm.goods_cat[2])
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 15px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.picPreview {
  width: 100%;
}
.addbtn {
  margin-top: 15px;
}
</style>
