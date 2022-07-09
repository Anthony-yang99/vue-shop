import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login-view.vue'
import Home from '@/views/home-view.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  // 如果要去的页面就是登录，则直接放行
  if (to.path === '/login') return next()
  // 获取token，如果没有token就跳转登录页面
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
