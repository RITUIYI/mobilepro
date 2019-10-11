import Vue from 'vue'
import Vuex from 'vuex'

import { setUser, getUser } from '@/utils/storage/'

// //永久持久化插件
// import VuexPersistence from 'vuex-persist'
// //配置vuex
// const vuexLocal = new VuexPersistence({
//   storage: window.localStorage
// })
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: getUser(),
    usrInfo: {},
    routerFrom: ''
  },
  mutations: {
    //设置token
    setToken(state, param) {
      setUser(param);
      state.token = param;
    },
    //设置用户详细信息
    setUsrInfo(state, usrInfo) {
      state.usrInfo = usrInfo;
    },
    //取出用户详细信息
    removeToken(state) {
      state.token = null;
    },
    //设置路由来源
    setRouterFrom(state, from) {
      state.routerFrom = from;
    },
    //设置用户本地数据头像
    setUsrAvatar(state, url) {
      state.usrInfo.photo = url;
    },
    //设置用户本地数据 昵称 介绍 性别 生日
    setInfo(state, { name, intro, gender, birthday }) {
      if (name) {
        state.usrInfo.name = name;
      }
      if (intro) {
        state.usrInfo.intro = intro;
      }
      if (gender) {
        state.usrInfo.gender = gender;
      }
      if (birthday) {
        state.usrInfo.birthday = birthday;
      }
    }
  },
  actions: {

  },
  // plugins: [vuexLocal.plugin]
})
