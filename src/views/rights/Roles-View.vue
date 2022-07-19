<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色表格 -->
      <el-table :data="this.RolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightsById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 == 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightsById(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightsById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRolesdDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoles(scope.row.id)"
              >删除</el-button
            >
            <el-button
              @click="setRights(scope.row)"
              size="mini"
              type="warning"
              icon="el-icon-setting"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesdialogVisible"
      width="50%"
      @close="addRolesDialogClose"
    >
      <el-form
        :model="addRolesForm"
        :rules="addRolesrules"
        ref="addRoleFormsRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRolesdialogVisible"
      width="50%"
      @close="editRolesDialogClose"
    >
      <el-form
        :model="editRolesForm"
        :rules="editRolesFormRules"
        ref="editRolesFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsdialogVisible"
      width="50%"
      @close="setRightsdialogClose"
    >
      <el-tree
        ref="RightsRef"
        :data="allRightsList"
        :props="RightsProps"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="defChkKey"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSetRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles-View',
  data() {
    return {
      // 角色列表
      RolesList: [],
      // 添加角色的对话框显示与隐藏
      addRolesdialogVisible: false,
      // 添加用户的表单数据
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色的表单验证规则
      addRolesrules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
        ]
      },
      // 修改角色的对话框显示与隐藏
      editRolesdialogVisible: false,
      // 修改角色的数据
      editRolesForm: {},
      // 修改角色的验证规则
      editRolesFormRules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
        ]
      },
      // 分配权限的对话框显示与隐藏
      setRightsdialogVisible: false,
      // 全部权限的列表
      allRightsList: [],
      // 显示在树形控件中的内容及子节点名称
      RightsProps: {
        children: 'children',
        label: 'authName'
      },
      // 分配权限的对话框打开后默认选中的权限
      defChkKey: [],
      // 即将被分配权限的角色id
      RolesId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 角色列表请求
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.RolesList = res.data
    },
    // 添加角色的对话框显示
    addRolesDialog() {
      this.addRolesdialogVisible = true
    },
    // 添加角色的对话框关闭监听
    addRolesDialogClose() {
      this.$refs.addRoleFormsRef.resetFields()
    },
    // 添加角色的方法
    addRoles() {
      // eslint-disable-next-line space-before-function-paren
      this.$refs.addRoleFormsRef.validate(async (vali) => {
        // console.log(vali)
        if (!vali) return this.$message.error('请输入角色名称')
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.getRolesList()
        this.addRolesdialogVisible = false
      })
    },
    // 编辑角色的按ID查询，并打开对话框
    async editRolesdDialog(id) {
      // console.log(id)
      this.editRolesdialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      // console.log(res)
      this.editRolesForm = res.data
    },
    // 监听修改角色对话框关闭事件
    editRolesDialogClose() {
      this.$refs.editRolesFormRef.resetFields()
    },
    // 修改角色
    editRoles() {
      // eslint-disable-next-line space-before-function-paren
      this.$refs.editRolesFormRef.validate(async (vali) => {
        if (!vali) return this.$message.error('请输入角色名称')
        const { data: res } = await this.$http.put(
          'roles/' + this.editRolesForm.roleId,
          {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc
          }
        )
        if (res.meta.status !== 200) return this.$message.error('修改角色失败')
        this.editRolesdialogVisible = false
        this.getRolesList()
        this.$message.success('修改成功')
      })
    },
    // 删除角色
    async removeRoles(id) {
      const result = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
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
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getRolesList()
    },
    // 删除详细权限标签
    async removeRightsById(roles, Rightsid) {
      const result = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
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
      const { data: res } = await this.$http.delete(
        `roles/${roles.id}/rights/${Rightsid}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      roles.children = res.data
    },
    // 分配权限的函数
    async setRights(roles) {
      this.setRightsdialogVisible = true
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.allRightsList = res.data
      console.log(this.allRightsList)
      this.getdefChkKey(roles, this.defChkKey)
      this.RolesId = roles.id
    },
    // 通过递归的形式把所有的三级权限的id赋值给defChkKey数组
    // node是节点的形参，arr是defChkKey数组的形参
    getdefChkKey(node, arr) {
      // 如果当前node节点下没有children属性，则说明是三级权限
      // 就把id保存到defChkKey数组
      if (!node.children) {
        return arr.push(node.id)
      }
      // 下面的循环就是先循环当前node节点的子节点，然后
      // 调用当前函数，把循环出来的子节点在传给函数，然后
      // 在走一遍，如果还有子节点就在循环一遍，如果没有子节点就
      // 说明是三级权限了
      node.children.forEach((item) => {
        this.getdefChkKey(item, arr)
      })
    },
    // 监听分配权限关闭的事件
    setRightsdialogClose() {
      this.defChkKey = []
    },
    // 分配权限的提交
    async submitSetRights() {
      // 传递到请求中的选中的节点的key值
      const keys = [
        ...this.$refs.RightsRef.getCheckedKeys(),
        ...this.$refs.RightsRef.getHalfCheckedKeys()
      ]
      const keyStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.RolesId}/rights`,
        { rids: keyStr }
      )
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightsdialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
