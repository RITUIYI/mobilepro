import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'

//导入Vant
import Vant from 'vant'
import 'vant/lib/index.css'

//导入图片裁剪插件
import VueClip from 'vue-clip'

Vue.use(VueClip)
Vue.use(Vant)

//配置dayjs插件
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn' // 按需加载
dayjs.locale('zh-cn')
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

Vue.filter('timeFormat', function (time) {
  return dayjs().from(time);
})
Vue.filter('timer', function (time) {
  return dayjs(time).format('YYYY-MM-DD')
})
Vue.filter('timerMS', function (time) {
  return dayjs(time).format('YYYY-MM-DD  HH : mm')
})

import { getUserInfo, getUser } from '@/utils/storage/'

//刷新页面 重新给store赋值
window.onload = () => {
  store.commit('setUsrInfo', getUserInfo());
  store.commit("setToken", getUser());
}

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
