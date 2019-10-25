import Vue from 'vue'
import Router from 'vue-router'
import login from '../views/login/'
import store from '../store/'
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    { path: '/chat', component: () => import('../views/ChatRobot/'), name: 'chatting' },
    {
      path: '/tabbar', component: () => import('../views/layout_bar/'), children: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: () => import('../views/home/') },
        { path: '/myaccount', component: () => import('../views/myInfo/') },
        { path: '/usrcenter', component: () => import('../views/myInfo/usrcenter/') },
        { path: '/search/:keyword', component: () => import('../views/search/') },
        { path: '/collect', component: () => import('../views/myInfo/collection/') },
        { path: '/works', component: () => import('../views/myInfo/myarticle/') }
      ]
    },
    { path: '/article/:id', component: () => import('../views/articleDetail/') }
  ]
})

/* Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
} */
//用于没有网络请求的页面的 登录状态权限限制
router.beforeEach((to, from, next) => {
  store.commit('setRouterFrom', from.fullPath);
  next();
})

export default router