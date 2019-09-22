import Vue from 'vue'
import Router from 'vue-router'
import login from '../views/login/'
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    { path: '/home', component: () => import('../views/home/') }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path != '/login') {
    if (window.sessionStorage.getItem('token')) {
      return next();
    } else {
      Vue.prototype.$dialog.alert({
        message: '请先登录'
      });
      return next('/login');
    }
  } else {
    return next();
  }
})

export default router