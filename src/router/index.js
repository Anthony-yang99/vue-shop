import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login-view.vue'
import Home from '@/views/home-view.vue'
import Wecome from '@/views/wecome-view.vue'
import Users from '@/views/user/Users-view.vue'
import Rights from '@/views/rights/rights-view.vue'
import Roles from '@/views/rights/Roles-View.vue'
import Cate from '@/views/goods/Cate-View.vue'
import Params from '@/views/goods/Params-View.vue'
import List from '@/views/goods/List-View.vue'
import Add from '@/views/goods/Add-View.vue'
import order from '@/views/order/Order-View.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/wecome',
    children: [
      { path: '/wecome', component: Wecome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: order }
    ]
  }
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
