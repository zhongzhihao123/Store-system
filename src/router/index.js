import Vue from 'vue'
import Router from 'vue-router'
// import Home from '../views/Home.vue'

// // import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// //实现路由懒加载  login-home-welcome表示放入路由的地方 ../components/Login.vue表示该路由的地址
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')


// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')

// import Goods from '../components/goods/Goods.vue'
// import Add from '../components/goods/Add.vue'
const Goods = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Goods.vue')
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Add.vue')

// import Order from '../components/order/Order.vue'
// import Report from '../components/Report/Report.vue'
const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/Report/Report.vue')
Vue.use(Router)





const router =  new Router({
  routes:[
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {
      path:'/home',
      component:Home,
      redirect:'/welcome',
      children:[
        {path:'/welcome',component:Welcome},
        {path:'/users',component:Users},
        {path:'/rights',component:Rights},
        {path:'/roles',component:Roles},
        {path:'/categories',component:Cate},
        {path:'/params',component:Params},
        {path:'/goods',component:Goods},
        {path:'/goods/add',component:Add},
        {path:'/orders',component:Order},
        {path:'/reports',component:Report}
      ]
    }
  ]
})

// 挂载路由导航守卫，防止还没登录就跳转到其他页面
router.beforeEach((to,from,next) => {
  //to将要访问的路径
  //from 代表从哪个路径跳转而来
  //next是一个函数，表示放行
  // next()放行  next('/login')强制跳转
  if(to.path === '/login') return next();
  //如果要访问其他页，先获取token
  const tokenStr =window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})
 export default router