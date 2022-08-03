<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加商品&搜索商品 -->
      <el-row :gutter="50">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6"
          ><el-button class="addbtn" type="primary" @click="showAddGoods"
            >添加商品</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格 -->
      <el-table :data="goodsList" style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="80px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="60px">
        </el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="60px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="110px">
          <template slot-scope="scope"
            >{{ scope.row.add_time | dataFomat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editById(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 编辑的弹窗 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editdialogClose"
    >
      <el-form
        :model="editGoodsForm"
        :rules="editGoodsFormRules"
        ref="editGoodsFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input
            v-model="editGoodsForm.goods_price"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input
            v-model="editGoodsForm.goods_number"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input
            v-model="editGoodsForm.goods_weight"
            type="number"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'List-View',
  data() {
    return {
      // 商品列表的查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表数据
      goodsList: [],
      // 商品列表总条数
      total: 0,
      // 编辑的弹窗显示与隐藏
      editdialogVisible: false,
      // 编辑商品信息的数据
      editGoodsForm: {
        goods_cat: []
      },
      // 编辑商品信息的规则
      editGoodsFormRules: {
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
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 商品列表的请求
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      // console.log(res.data)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 分页pagesize改变监听
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 分页页码值改变的监听
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 删除商品
    async removeById(id) {
      const result = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => {
        return err
      })
      if (result !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getGoodsList()
    },
    // 添加商品
    showAddGoods() {
      this.$router.push('/goods/add')
    },
    // 编辑商品
    async editById(id) {
      console.log(id)
      const { data: res } = await this.$http.get('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品信息失败')
      }
      // res.data.forEach((item) => {
      //   item.goods_cat = item.goods_cat.split(',')
      // })
      // res.data.goods_cat = res.data.item.goods_cat.split(',')
      this.editGoodsForm = res.data
      this.editGoodsForm.goods_cat = this.editGoodsForm.goods_cat.split(',')
      console.log(this.editGoodsForm)
      this.editdialogVisible = true
    },
    // 监听编辑商品关闭事件
    editdialogClose() {
      this.$refs.editGoodsFormRef.resetFields()
    },
    // 编辑商品提交
    editGoods() {
      // eslint-disable-next-line space-before-function-paren
      this.$refs.editGoodsFormRef.validate(async (vali) => {
        if (!vali) {
          return this.$message.error('请填写合法字段')
        }
        // 提交的正常业务逻辑

        const { data: res } = await this.$http.put(
          `goods/${this.editGoodsForm.goods_id}`,
          {
            goods_name: this.editGoodsForm.goods_name,
            goods_price: this.editGoodsForm.goods_price,
            goods_number: this.editGoodsForm.goods_number,
            goods_weight: this.editGoodsForm.goods_weight,
            goods_introduce: this.editGoodsForm.goods_introduce,
            pics: this.editGoodsForm.pics,
            attrs: this.editGoodsForm.attrs
          }
        )
        console.log(res.data)
        if (res.meta.status !== 201) {
          return this.$message.error('编辑商品信息提交失败')
        }
        this.editdialogVisible = false
        this.getGoodsList()
        this.$message.success('修改成功')
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
