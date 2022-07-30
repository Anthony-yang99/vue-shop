<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告提示 -->
      <el-alert
        title="注意！只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectKeys"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children'
            }"
            @change="handleChange"
            clearable
          ></el-cascader>
          <!-- 点击标签 -->
          <el-tabs v-model="activeName" @tab-click="handleTabsClick">
            <el-tab-pane label="动态参数" name="many">
              <el-button
                type="primary"
                size="mini"
                :disabled="isBtnDistabl"
                @click="showaddDialog"
                >添加参数</el-button
              >
              <!-- 动态参数 -->
              <el-table :data="manyDataList" style="width: 100%" border>
                <!-- 展开行 -->
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <!-- 渲染tag标签 -->
                    <el-tag
                      v-for="(item, i) in scope.row.attr_vals"
                      :key="i"
                      closable
                      @close="handleCloseTag(i, scope.row)"
                      >{{ item }}</el-tag
                    >
                    <!-- 新建tag标签 -->
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                      >+ New Tag</el-button
                    >
                  </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="attr_name" label="参数名称">
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-edit"
                      @click="editParams(scope.row.attr_id)"
                      >编辑</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="deleteParams(scope.row.attr_id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
              <el-button
                type="primary"
                size="mini"
                :disabled="isBtnDistabl"
                @click="showaddDialog"
                >添加属性</el-button
              >
              <!-- 静态属性 -->
              <el-table :data="onlyDataList" style="width: 100%" border>
                <!-- 展开行 -->
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <!-- 渲染tag标签 -->
                    <el-tag
                      v-for="(item, i) in scope.row.attr_vals"
                      :key="i"
                      closable
                      @close="handleCloseTag(i, scope.row)"
                      >{{ item }}</el-tag
                    >
                    <!-- 新建tag标签 -->
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                      >+ New Tag</el-button
                    >
                  </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="attr_name" label="属性名称">
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-edit"
                      @click="editParams(scope.row.attr_id)"
                      >编辑</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="deleteParams(scope.row.attr_id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加参数弹窗 -->
    <el-dialog
      :title="'添加' + addTitle"
      :visible.sync="addParamsdialogVisible"
      width="50%"
      @close="addParamsdialogClose"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormrules"
        ref="addParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="addTitle" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数弹窗 -->
    <el-dialog
      :title="'编辑' + addTitle"
      :visible.sync="editParamsdialogVisible"
      width="50%"
      @close="editParamsdialogClose"
    >
      <el-form
        :model="editParamsForm"
        :rules="editParamsFormrules"
        ref="editParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="addTitle" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsSub">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params-View',
  data() {
    return {
      // 所有的分类数据对象
      cateList: [],
      // 级联选择器选中的分类的id
      selectKeys: [],
      // 标签页选中的标签名称
      activeName: 'many',
      // 动态参数数据
      manyDataList: [],
      // 静态参数数据
      onlyDataList: [],
      // 添加参数弹窗显示与隐藏
      addParamsdialogVisible: false,
      // 添加参数的表单数据
      addParamsForm: {
        attr_name: ''
      },
      // 添加参数的规则
      addParamsFormrules: {
        attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }]
      },
      // 编辑参数的显示与隐藏
      editParamsdialogVisible: false,
      // 编辑参数的表单数据
      editParamsForm: {},
      // 编辑参数的规则
      editParamsFormrules: {
        attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      // console.log(res)
      this.cateList = res.data
      // console.log(this.cateList)
    },
    // 级联选择器发生改变时的监听函数
    handleChange() {
      this.getParamsData()
      if (this.selectKeys.length < 3) {
        this.selectKeys = []
        this.manyDataList = []
        this.onlyDataList = []
        return
      }
    },
    // 发起分类参数请求
    async getParamsData() {
      // console.log(this.selectKeys)
      if (this.selectKeys.length < 3) {
        this.selectKeys = []
        return
      }

      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类参数失败')
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 新建tag标签的input显示与隐藏
        item.inputVisible = false
        // 新建tag标签的input的双向绑定数据
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyDataList = res.data
      } else {
        this.onlyDataList = res.data
      }
    },
    // 标签页选中时触发的函数
    handleTabsClick() {
      this.getParamsData()
    },
    // 显示添加参数弹窗
    showaddDialog() {
      this.addParamsdialogVisible = true
    },
    // 添加参数弹窗关闭事件
    addParamsdialogClose() {
      this.$refs.addParamsFormRef.resetFields()
    },
    // 添加参数提交
    addParams() {
      // eslint-disable-next-line space-before-function-paren
      this.$refs.addParamsFormRef.validate(async (vali) => {
        if (!vali) {
          this.$message.error('请输入参数')
        }
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加成功')
        this.addParamsdialogVisible = false
        this.getParamsData()
      })
    },
    // 编辑参数的弹窗显示
    async editParams(attrid) {
      this.editParamsdialogVisible = true
      // 按ID查询参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrid}`,
        { attr_sel: this.activeName }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('查询参数失败')
      }
      this.editParamsForm = res.data
    },
    // 编辑参数的关闭事件
    editParamsdialogClose() {
      this.$refs.editParamsFormRef.resetFields()
    },
    // 编辑参数提交
    editParamsSub() {
      // eslint-disable-next-line space-before-function-paren
      this.$refs.editParamsFormRef.validate(async (vali) => {
        if (!vali) {
          this.$message.error('请输入参数')
        }
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新参数失败')
        }
        this.editParamsdialogVisible = false
        this.$message.success('更新成功')
        this.getParamsData()
      })
    },
    // 删除参数
    async deleteParams(attrid) {
      const result = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => {
        return err
      })
      // console.log(result)
      if (result !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attrid}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getParamsData()
    },
    // 新建tag标签失去焦点监听
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果输入结果不为空，就不return出去，继续执行后续
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      this.saveParamsTags(row)
      row.inputVisible = false
    },
    // 保存新建的参数到数据库
    async saveParamsTags(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数失败')
      }
      this.$message.success('修改参数成功')
    },
    // 新建tag标签button点击事件
    // $nextTick方法在DOM元素渲染结束后再执行回调函数
    showInput(row) {
      row.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // tag标签的关闭事件
    handleCloseTag(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveParamsTags(row)
    }
  },
  computed: {
    // 参数按钮要隐藏时就返回true,否则就返回false
    isBtnDistabl() {
      if (this.selectKeys.length < 3) {
        return true
      }
      return false
    },
    // 获取到当前选中的分类的id
    cateId() {
      if (this.selectKeys.length === 3) {
        // console.log(this.selectKeys[2])
        return this.selectKeys[2]
      }
      return null
    },
    // 添加参数弹窗的title
    addTitle() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 15px;
}
.input-new-tag {
  width: 150px;
}
</style>
