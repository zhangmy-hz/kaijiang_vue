import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import home from '../components/home'
import welcome from '../components/welcome'
import users from '../views/user/users'
import power from '../views/power/power'
import sku from '../views/SKU/sku'
import color from '../views/Basics/color'
import Size from '@/views/Basics/Size'
import Style from '@/views/Basics/Style'
import Pack_method from '@/views/Basics/Pack_method'
import SkuType from '../views/Basics/SkuType'
import Order from '../views/order/Order'
import express from '../views/Basics/express'
import words from '../views/Basics/words'
import Order_new from '../views/order/Order_new'
import Order_update from '../views/order/Order_update'
import drawing from '../views/Drawing/drawing'
import complete from '../views/complete/complete'
import packing from '../views/packing/packing'
import OrderOut from '../views/OrderOut/OrderOut'
import print_test from '../views/print_test'
import page_list from '../views/page_list/page_list'
import stay_draw from '@/views/Drawing/stay_draw'
import draw_pi from '@/views/Drawing/draw_pi'
import draw_pi_see from '@/views/Drawing/draw_pi_see'
import draw_again from '@/views/Drawing/draw_again'
import order_see from '@/views/order/order_see'
import draw_report from '@/views/report/draw_report'
import order_track from '@/views/report/order_track'
import Warehousing from '@/views/stock/Warehousing/Warehousing'
import Warehouse_new from '@/views/stock/Warehousing/Warehouse_new'
import Contacts from '@/views/stock/basic/Contacts'
import cl_sku from '@/views/stock/basic/cl_sku'
import Warehouse_update from '@/views/stock/Warehousing/Warehouse_update'
import Warehouse_see from '@/views/stock/Warehousing/Warehouse_see'
import Inventory_details from '@/views/stock/report/Inventory_details'
import draw_pi_see_picture from '@/views/Drawing/draw_pi_see_picture'
import Warehous_out from '@/views/stock/Warehouse_out/Warehous_out'
import Warehouse_out_new from '@/views/stock/Warehouse_out/Warehouse_out_new'
import Warehouse_out_see from '@/views/stock/Warehouse_out/Warehouse_out_see'
import Warehouse_out_update from '@/views/stock/Warehouse_out/Warehouse_out_update'
import order_test from '@/views/order/order_test'
import test_table from '@/views/test/test_table'
import Inventory_account from '@/views/stock/report/Inventory_account'
import preview_order from '@/views/order/preview_order'


// 导入全局样式
import '../assets/css/global.css'
// 以下三行，配置axios
import axios from 'axios'

// vue配置后台请求的URL地址，组件里面直接拼接就行
axios.defaults.baseURL = 'http://47.114.190.252:8888/'
//axios.defaults.baseURL = 'http://127.0.0.1:8883/'

axios.defaults.withCredentials = true
Vue.prototype.$http = axios
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    // redirect: '/welcome', //相当于首页
    children: [
      { path: '/welcome', component: welcome },
      { path: '/4-1', component: users }, // 用户连接的代码
      { path: '/4-2', component: power }, // 用户连接的代码
      { path: '/1-1', component: color }, // 用户连接的代码
      { path: '/1-2', component: express }, // 快递信息
      { path: '/1-3', component: words }, // 文字信息
      //{ path: '/1-4', component: test_table }, // 测试
      { path: '/1-5', component: SkuType }, // 用户连接的代码
      { path: '/1-6', component: sku }, // 用户连接的代码
      { path: '/1-7', component: Size }, // 用户连接的代码
      { path: '/1-8', component: Style }, // 风格
      { path: '/1-9', component: Pack_method }, // 风格
      { path: '/2-1', component: Order}, // 订单界面
      { path: '/2-2', component: drawing }, // 订单界面
      { path: '/2-1-2', component: Order_update }, // 订单新增
      //{ path: '/2-1-2', component: order_test }, // 订单新增
      { path: '/2-1-1', component: Order_new }, // 订单新增
      { path: '/2-1-4', component: preview_order }, // 订单预览
      { path: '/2-1-3', component: order_see }, // 订单查看
      { path: '/2-3', component: complete }, // 订单完成打印界面
      { path: '/2-4', component: packing }, // 订单包装界面
      { path: '/2-5', component: OrderOut }, // 订单出库界面
      { path: '/2-6', component: stay_draw }, // 待画图
      { path: '/2-7', component: draw_again }, // 拉图
      { path: '/2-8', component: draw_pi, meta:{keepAlive:true}   //设置页面需要缓存
      }, // 画图批次
      { path: '/2-8-1', component: draw_pi_see }, // 查看画图明细
      { path: '/2-8-2', component: draw_pi_see_picture }, // 查看画图明细--图片模式
      { path: '/2-6-1', component: stay_draw }, // 画图批次界面
      { path: '/3-1', component: order_track }, // 订单跟踪表
      { path: '/3-2', component: page_list }, // 包装明细表
      { path: '/3-3', component: draw_report }, // 画图明细表
      { path: '/5-1', component: Warehousing }, // 入库管理
      { path: '/5-2', component: Warehous_out }, // 出库管理
      { path: '/5-3', component: Contacts }, // 往来对象单身
      { path: '/5-4', component: cl_sku }, // 原材料信息表
      { path: '/5-5', component: Inventory_details }, // 库存明细表
      { path: '/5-6', component: Inventory_account }, // 库存明细账
      { path: '/5-1-1', component: Warehouse_new }, // 新增入库单
      { path: '/5-2-1', component: Warehouse_out_new }, // 新增出库单
      { path: '/5-1-2', component: Warehouse_update }, // 修改入库单
      { path: '/5-1-3', component: Warehouse_see }, // 查看入库单
      { path: '/5-1-4', component: print_test } // 查看入库单
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title = '开疆录单系统'
  if (to.path === '/' ) {
    return next()// 登录页访问放行
  } else {
    var token = window.sessionStorage.getItem('token')// 获得token
    if (!token) {
      alert('尚未登陆')
      return next('/')
    } else {
      return next()
    }
  }
})
export default router
