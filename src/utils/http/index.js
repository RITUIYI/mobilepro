import axios from 'axios'
import router from '../../router/'
const topLine = axios.create({
    baseURL: "http://ttapi.research.itcast.cn"
})
//登录请求
export const login = (params) => {
    return topLine.post('/app/v1_0/authorizations', params);
}
//获取全部频道请求
export const getChannelList = () => {
    return topLine.get('/app/v1_0/channels');
}
//获取对应频道新闻推荐
export const getRecommand = (params) => {
    return topLine.get('/app/v1_1/articles',{params});
}


topLine.interceptors.request.use(function (config) {
    if (config.url.indexOf('authorizations') != -1) {
        return config;
    }

    try {
        let token = JSON.parse(window.sessionStorage.getItem('token'));
        if (token == null) {
            Vue.prototype.$dialog.alert({
                message: '请先登录'
            });
            router.push('/login')
        }
    } catch (error) {
        Vue.prototype.$dialog.alert({
            message: '请先登录'
        });
        router.push('/login')
    }
    config.headers.Authorization = `Bearer ${JSON.parse(window.sessionStorage.getItem('token'))}`;
    
    return config;
}) 

topLine.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response.status == 401) {
        Vue.prototype.$dialog.alert({
            message: '请先登录'
        });
        router.push('/login')
    }
    return Promise.reject(error);
})
