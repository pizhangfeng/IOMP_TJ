import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import axios from 'axios'
import echarts from 'echarts'
import echartsGL from 'echarts-gl'


// 引入全局样式文件
import './assets/css/global.less'

// 引入字体文件
import './assets/font/iconfont.css'

// 引入 socket_service
import SocketService from './utils/socket_service'
// 对服务端进行 webSocket的连接
SocketService.Instance.connect()
Vue.prototype.$socket = SocketService.Instance

//全局定义eventBus
Vue.prototype.$EventBus = new Vue()

// axios 配置接口默认路径
// axios.defaults.baseURL = 'http://101.34.160.195:8888/api/'
// Vue.prototype.$http = axios

// 把echarts挂载到 Vue原型上，以便在全局访问
Vue.prototype.$echarts = echarts
Vue.prototype.$echartsGL = echartsGL
// 引入主题
import './assets/lib/theme/chalk'
import './assets/lib/theme/vintage'
import './assets/lib/theme/westeros'
import dataV from '@jiaminghi/data-view'

Vue.use(dataV)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
