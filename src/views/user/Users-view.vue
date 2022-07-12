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
          ><el-input placeholder="请输入内容">
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="6">
          <el-button type="primary">添加用户</el-button>
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
            <el-switch v-model="scope.row.mg_state"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UsersView',
  data() {
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
      total: 0
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
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.userInfo.pagenum = res.data.pagenum
      this.total = res.data.total
    }
  }
}
</script>

<style lang="less" scoped>
</style>
