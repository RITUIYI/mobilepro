import axios from 'axios'
import store from '@/store/'
import router from '../../router/'
import Vue from 'vue'
import jsonBigint from 'json-bigint'
import { removeUser, getUser } from '../../utils/storage/'
export const topLine = axios.create({
    baseURL: "http://ttapi.research.itcast.cn"
})

topLine.defaults.transformResponse = [
    function (data) {
        try {
            return (jsonBigint.parse(data));
        } catch (error) {
            return data;
        }
    }
]

topLine.interceptors.request.use(function (config) {
    /*  if (config.url.indexOf('authorizations') != -1) {
         return config;
     }
 
     try {
         let token = getUser();
         if (token == null) {
             console.log(111);
 
             Vue.prototype.$dialog.alert({
                 message: '请先登录'
             });
             router.push('/login')
         }
     } catch (error) {
         this.$notify({ type: 'warning', message: '请先登录' });
         router.push('/login')
     } */
    let userToken = store.state.token;
    if (userToken) {
        let token = userToken.token;
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

topLine.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    console.dir(error);

    let userInfo = getUser();

    if (error.response.status == 401) {
        //两种情况
        //token过期  刷新token
        if (userInfo) {
            let res = await axios({
                url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
                method: 'put',
                headers: {
                    Authorization: `Bearer ${store.state.token.refresh_token}`
                }
            })
            store.commit('setToken', {
                token: res.data.data.token,
                refresh_token: store.state.token.refresh_token
            })
            return topLine(error.config)
            //没有token 跳转至登录页
        } else {
            Vue.prototype.$dialog.alert({
                message: '登录状态过期,请重新登录'
            });
        }
    }
    return Promise.reject(error);
})