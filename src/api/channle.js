import { topLine } from '@/utils/http/'

//获取用户频道请求
export const getChannelList = () => {
    return topLine.get('/app/v1_0/user/channels');
}
//获取对应频道新闻推荐
export const getRecommand = (params) => {
    // return topLine.get('/app/v1_0/articles', { params });
    return topLine.get('/app/v1_1/articles', { params });
}

//获取全部频道列表
export const getAllChannelList = () => {
    return topLine.get('/app/v1_0/channels');
}

//编辑用户频道列表
export const editUserChannel = (channels) =>{
    return topLine.put('/app/v1_0/user/channels',{
        channels
    })
}