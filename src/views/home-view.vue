<template>
  <el-container class="home-w">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="quit">登出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside :width="iscollapse ? '56px' : '200px'">
        <!-- 折叠按钮 -->
        <div class="fold" @click="foldMenu">|||</div>
        <!-- 左侧边栏菜单 -->
        <!-- this.$route.path会获取当前路由路径,刷新之后也可以知道当前要激活的item项
        default-active表示当前激活的路由地址是谁，就激活谁
         -->
        <el-menu
          class="el-menu-vertical-demo"
          unique-opened
          text-color="#51575f"
          :collapse="iscollapse"
          :collapse-transition="false"
          active-text-color="#409EFF"
          :default-active="this.$route.path"
          router
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in meunList"
            :key="item.id"
          >
            <!-- 一级菜单内容模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="fontIcon[item.id]"></i>
              <!-- 内容文字 -->
              <span slot="title">{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边内容区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home-view',
  data() {
    return {
      meunList: [],
      fontIcon: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-lock_fill',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      iscollapse: false
    }
  },
  created() {
    this.getLeftMenu()
  },
  methods: {
    // 登出功能
    quit() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    // 获取左侧菜单数据
    async getLeftMenu() {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.meunList = res.data
      // console.log(this.meunList)
    },
    // 折叠左侧菜单按钮
    foldMenu() {
      this.iscollapse = !this.iscollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home-w {
  height: 100%;
}
.el-header {
  background-color: #373d46;
  display: flex;
  justify-content: space-between;
  color: #fff;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #373d46;
  .el-menu {
    background-color: #373d46;
    border: none;
    i {
      color: #51575f;
      margin-right: 10px;
    }
  }
}
.fold {
  display: flex;
  justify-content: center;
  width: 100%;
  line-height: 40px;
  color: #51575f;
  cursor: pointer;
}
.fold:hover {
  background-color: #fff;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
}
</style>
