import Vue from 'vue'
import App from './App.vue'
import router from './router'
//优化element-ui，所以直接在Index.html加载css和js就可以
// import './plugins/element.js'


//获取axios 
import axios from 'axios'

// 导入全局样式
import './assets/css/global.css'
// 引入vue-tabel-with-tree插件
import TreeTabel from 'vue-table-with-tree-grid'

//导入编辑器插件
import VueQuillEditor from 'vue-quill-editor'
//导入编辑器所需样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import vueQuillEditor from 'vue-quill-editor'


Vue.use(vueQuillEditor)

//导入NProgrss包对应的JS和CSS  这是进度条，可以在请求token时开始进度条NProgress.start()，结束时进度条完成NProgress.done()
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


Vue.config.productionTip = false
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截，进行请求预处理，可以让有权限的api先进行判断是否带有token
axios.interceptors.request.use(config => {
  // console.log(config)
  //开始进度条
  NProgress.start()
  // 有权限的api要吧token放在请求头里
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
//把axios请求赋予到vue的原型的http上，可以全局使用
Vue.prototype.$http = axios

Vue.component('tree-tabel',TreeTabel)
//全局过滤器Vue.filter('过滤器名字',function(){})   处理时间
Vue.filter('dateFormat',function(orginVal){
  const dt = new Date(orginVal)
  const y = dt.getFullYear()
  const m =(dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate()+'' ).padStart(2,'0') 
  const hh =(dt.getHours()+'' ).padStart(2,'0') 
  const mm =(dt.getMinutes()+'' ).padStart(2,'0')
  const ss = (dt.getSeconds()+'' ).padStart(2,'0')  
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
