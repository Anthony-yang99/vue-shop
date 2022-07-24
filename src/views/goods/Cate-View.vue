<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDiag">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tableTree
        class="tabletree"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        :show-row-hover="false"
      >
        <template slot="isok" scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted == true"
            style="color: green"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <template slot="rank" scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level == 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showEditCatedialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="removeCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tableTree>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="questList.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="questList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的弹框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatedialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <!-- 添加表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            ref="cascaderRef"
            v-model="selectKeys"
            :options="ParentCateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              checkStrictly: true
            }"
            @change="addCatehandleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类的弹出 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCatedialogVisible"
      width="50%"
      @close="editCatedialogClose"
    >
      <el-form
        :model="editCateFrom"
        :rules="editCateFromRules"
        ref="editCateFromRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateFrom.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate-View',
  data() {
    return {
      // 商品分类的数据列表
      cateList: [],
      // 请求的参数
      questList: {
        // 分类的级数
        type: 3,
        // 当前显示的页码
        pagenum: 1,
        // 当前显示的条数
        pagesize: 5
      },
      // 总条数
      total: 0,
      // 表格的列数据
      columns: [
        // 分类名称
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 类型
          type: 'template',
          // 模板名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'rank'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 添加分类的弹窗是否显示
      addCatedialogVisible: false,
      // 添加表单的数据对象
      addCateForm: {
        // 分类名称
        cat_name: '',
        // 分类父 ID,如果要添加1级分类，则父分类Id应该设置为  `0`
        cat_pid: 0,
        // 分类层级,`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level: 0
      },
      // 添加分类的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类的数据数组
      ParentCateList: [],
      // 父级分类级联选择器当前选中的值得id
      selectKeys: [],
      // 修改分类的显示与隐藏
      editCatedialogVisible: false,
      // 修改分类的数据对象
      editCateFrom: {
        cat_id: 0,
        cat_name: ''
      },
      // 修改分类规则
      editCateFromRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 商品分类请求函数
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.questList
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      // console.log(res)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听表格条数改变
    handleSizeChange(newSize) {
      this.questList.pagesize = newSize
      this.getCateList()
    },
    // 监听页数改变
    handleCurrentChange(newPage) {
      this.questList.pagenum = newPage
      this.getCateList()
    },
    // 显示添加用户的弹窗
    showAddDiag() {
      this.getParentCateList()
      this.addCatedialogVisible = true
    },
    // 获取所有的父级分类
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类列表失败')
      }
      console.log(res.data)
      this.ParentCateList = res.data
    },
    // 父级分类级联选择器改变时的函数
    addCatehandleChange() {
      // dropDownVisible属性可以设置选择之后下拉菜单是否上拉
      this.$refs.cascaderRef.dropDownVisible = false
      // console.log(this.selectKeys)
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addCateForm.cat_level = this.selectKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类
    addCate() {
      // eslint-disable-next-line space-before-function-paren
      this.$refs.addCateFormRef.validate(async (vali) => {
        if (!vali) return this.$message.error('请输入合法字段')
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.getCateList()
      })
      this.addCatedialogVisible = false
      // console.log(this.addCateForm)
    },
    // 监听添加分类的弹框关闭事件
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 修改分类的显示
    async showEditCatedialog(id) {
      this.editCatedialogVisible = true
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('按id查询分类失败')
      }
      // console.log(res.data)
      this.editCateFrom.cat_id = res.data.cat_id
      this.editCateFrom.cat_name = res.data.cat_name
    },
    // 监听修改分类的关闭
    editCatedialogClose() {
      this.$refs.editCateFromRef.resetFields()
    },
    // 修改分类提交
    editCate() {
      // eslint-disable-next-line space-before-function-paren
      this.$refs.editCateFromRef.validate(async (vali) => {
        if (!vali) return this.$message.error('请输入分类名称')
        const { data: res } = await this.$http.put(
          'categories/' + this.editCateFrom.cat_id,
          { cat_name: this.editCateFrom.cat_name }
        )
        // console.log(this.editCateFrom)
        if (res.meta.status !== 200) {
          return this.$message.error('添加分类失败')
        }

        this.editCatedialogVisible = false
        this.getCateList()
        this.editCateFrom.cat_id = 0
        this.editCateFrom.cat_name = ''
        this.$message.success('修改成功')
      })
    },
    // 删除分类
    async removeCate(id) {
      const result = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
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
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.tabletree {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
