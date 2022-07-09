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

Vue.config.productionTip = false
// axios挂载到vue原型上
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
