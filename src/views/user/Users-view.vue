<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card class="box-card">
      <el-row :gutter="50">
        <el-col :span="10"
          ><el-input
            placeholder="请输入内容"
            v-model="userInfo.query"
            :clearable="true"
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="6">
          <el-button type="primary" @click="adddialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="this.userList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="role_name" label="账号类型"> </el-table-column>
        <el-table-column prop="" label="状态">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <!-- 修改用户 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="editDialog(scope.row.id)"
            ></el-button>
            <!-- 删除用户 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="设置"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="userInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="addUserDialogClose"
    >
      <!-- 主体内容 -->
      <el-form
        :model="addUserForm"
        :rules="addUserrules"
        ref="addUserFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 修改用的表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色弹出框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRolesdialogVisible"
      width="30%"
      @close="setRoleClose"
    >
      <div>
        <p>当前用户:{{ userRow.username }}</p>
        <p>当前角色:{{ userRow.role_name }}</p>
        <p>分配角色</p>
        <el-select v-model="selectRoleId" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSetRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UsersView',
  data() {
    // 邮箱的自定义匹配规则
    const checkEmail = (rule, value, callback) => {
      const regEmail =
        /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 手机号的自定义匹配规则
    const checkMobile = (rule, value, callback) => {
      const regMobile =
        /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号'))
    }
    return {
      userInfo: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示的条数
        pagesize: 2
      },
      // 保存用户数据
      userList: [],
      // 用户数据总条数
      total: 0,
      // 添加表单的显示与隐藏
      adddialogVisible: false,
      // 表单数据对象
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单验证规则
      addUserrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      // 修改用户弹窗的隐藏于显示
      editdialogVisible: false,
      // 修改用户查询的用户数据
      editForm: {},
      // 修改用户的表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      // 分配角色弹出框显示与隐藏
      setRolesdialogVisible: false,
      // 当前分配角色的用户
      userRow: {},
      // 所有的角色列表
      roleList: [],
      // 下拉框选择的项
      selectRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 请求用户数据
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.userInfo
      })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.userInfo.pagenum = res.data.pagenum
      this.total = res.data.total
    },
    // 监听pagesize改变事件
    handleSizeChange(newPageSize) {
      // console.log(newPageSize)
      this.userInfo.pagesize = newPageSize
      this.getUserList()
    },
    // 监听pagenum改变事件
    handleCurrentChange(newPageNum) {
      // console.log(new·PageNum)
      this.userInfo.pagenum = newPageNum
      this.getUserList()
    },
    // 用户状态改变监听函数
    async userStatusChange(userInfo) {
      // console.log(userInfo)
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
      }
    },
    // 监听添加用户表单的关闭事件
    addUserDialogClose() {
      this.$refs.addUserFormRef.resetFields()
    },
    // 添加用户的方法
    addUser() {
      this.$refs.addUserFormRef.validate((vali) => {
        console.log(vali)
        if (!vali) return this.$message.error('请输入合法字段')
        this.addUserquer()
      })
      this.adddialogVisible = false
    },
    // 添加用户的请求
    async addUserquer() {
      const { data: res } = await this.$http.post('users', this.addUserForm)
      // console.log(res)
      if (res.meta.status !== 201) return this.$message.error('添加用户失败')
      this.$message.success('添加用户成功')
      this.getUserList()
    },
    // 修改用户的弹窗弹出
    async editDialog(id) {
      this.editdialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      // console.log(res.data.id)
      if (res.meta.status !== 200) return this.$message.error('查询数据失败')
      this.editForm = res.data
    },
    // 修改表单关闭重置
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息函数
    editUser() {
      this.$refs.editFormRef.validate((vali) => {
        // console.log(vali)
        if (!vali) return this.$message.error('请输入合法字段')
      })
      this.editUserquer()
      this.editdialogVisible = false
      this.getUserList()
      this.$message.success('修改成功')
    },
    // 修改用户请求函数
    async editUserquer() {
      const { data: res } = await this.$http.put('users/' + this.editForm.id, {
        email: this.editForm.email,
        mobile: this.editForm.mobile
      })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('修改失败')
    },
    // 删除用户
    async removeUser(id) {
      const result = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        // 捕获点取消后的error，并返回出来
      ).catch((err) => {
        return err
      })
      // console.log(result)
      if (result !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getUserList()
    },
    // 用户设置按钮
    async setRole(userRow) {
      this.setRolesdialogVisible = true
      this.userRow = userRow
      // 获取所有角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('角色列表获取失败')
      }
      this.roleList = res.data
      // console.log(this.roleList)
    },
    // 分配角色确定按钮
    async submitSetRole() {
      if (!this.selectRoleId) {
        this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userRow.id}/role`,
        {
          rid: this.selectRoleId
        }
      )
      if (res.meta.status !== 200) return this.$message.error('分配角色失败')
      this.$message.success('分配角色成功')
      this.getUserList()
      this.setRolesdialogVisible = false
    },
    // 分配角色的对话框关闭监听
    setRoleClose() {
      this.selectRoleId = ''
    }
  }
}
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
</style>
