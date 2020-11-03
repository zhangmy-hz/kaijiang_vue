import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'


// import Print from 'vue-print-nb'// 引入打印组件
import VueBarcode from 'vue-barcode'// 引入条码组件

import store from './store'
// import getLodap from './views/ptintJS/LodopFuncs' // 引入打印的JS文件
// window.$ = window.jQuery = require('jquery')

// Vue.use(Print)// 注册打印组件
Vue.use(VueBarcode)// 注册条码组件
Vue.component('barcode', VueBarcode)
Vue.config.productionTip = false
// Vue.prototype.$role_tree_list = []//先定义为空,后面会再次复制

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
