<template>
  <div class="login-w">
    <!-- 登录框 -->
    <div class="login-frame">
      <div class="login-photo">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单输入 -->
      <el-form
        :rules="loginFormRule"
        :model="loginFormData"
        ref="loginFormRef"
        class="login-form"
      >
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input
            placeholder="请输入账号"
            prefix-icon="iconfont icon-user"
            v-model="loginFormData.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            prefix-icon="iconfont icon-3702mima"
            v-model="loginFormData.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="login-btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { loginAPI } from '@/API/articleAPI.js'
export default {
  name: 'login-view',
  data() {
    return {
      loginFormData: {
        username: 'admin',
        password: '123456'
      },
      loginFormRule: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置输入框内的内容
    reset() {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    // 登录功能
    login() {
      // eslint-disable-next-line space-before-function-paren
      this.$refs.loginFormRef.validate(async (valid) => {
        // eslint-disable-next-line no-useless-return
        if (!valid) return
        // console.log('登录成功')
        // const { data: res } = await loginAPI(
        //   this.loginFormData.username,
        //   this.loginFormData.password
        // )
        // console.log(this.loginFormData)
        // console.log(res)
        // if (res.meta.status !== 200) return this.$message.error('登录失败')
        // this.$message.success('登录成功')
        const { data: res } = await this.$http.post('login', this.loginFormData)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 保存token
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-w {
  height: 100%;
  background-color: #2b4b6b;
  .login-frame {
    width: 500px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px #000;
    .login-photo {
      position: absolute;
      left: 50%;
      top: -50px;
      transform: translate(-50%);
      width: 130px;
      height: 130px;
      border: 1px solid rgb(214, 212, 212);
      background-color: #fff;
      border-radius: 50%;
      overflow: hidden;
      padding: 5px;
      box-sizing: border-box;
      box-shadow: 0 0 10px #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: rgb(214, 212, 212);
      }
    }
    .login-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }
    .login-btn {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
