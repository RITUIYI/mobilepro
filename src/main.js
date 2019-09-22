import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'

//导入Vant
import Vant from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)

//导入适配插件
import 'postcss-pxtorem'//导入 并在postcss.config.js 进行配置
import 'amfe-flexible/' //导入即可  动态匹配当前设备宽度

//导入公共样式
import '@/assets/css/base.less'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
