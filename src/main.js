import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 全局样式
import './assets/css/global.css'
// 图标字体
import '@/assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
// 导入表格插件
import ZkTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false

// 把富文本编辑器挂载到vue上
Vue.use(VueQuillEditor)

// 把表格插件注册为vue组件
Vue.component('tableTree', ZkTable)

// axios拦截器确保有权限获取数据
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  return config
})
// axios挂载到vue原型上,
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

// 定义时间过滤器
// eslint-disable-next-line space-before-function-paren
Vue.filter('dataFomat', function (originVal) {
  // 把要调用这个函数的时间传进来，然后获取到年月日时分秒
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
