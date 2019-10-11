import { topLine } from '../utils/http/'
//登录请求
export const login = (params) => {
    return topLine.post('/app/v1_0/authorizations', params);
}

//获取用户id
export const getUserId = () => {

    return topLine.patch('/app/v1_0/user/photo')
}

//获取用户个人资料 // 不带性别 手机号
export const getUserInfo = (id) => {
    return topLine.get('/app/v1_0/user', { target: id });
}
//获取用户资料   带性别  手机号
export const getGenderPhone = (id) => {
    return topLine.get('/app/v1_0/user/profile', { target: id });
}

//获取用户的关注列表
export const getUserFollowing = (id, page = 1, per_page = 20) => {
    return topLine.get('/app/v1_0/user/followings', { target: id }, {
        params: {
            page,
            per_page
        }
    });
}

//拉黑作者
export const blockAuthor = (aut_id) => {
    return topLine.post('/app/v1_0/user/blacklists', {
        target: aut_id
    })
}

//关注用户
export const followUser = (aut_id) => {
    return topLine({
        url: '/app/v1_0/user/followings',
        method: 'post',
        data: {
            target: aut_id
        }
    })
}

//取消关注用户
export const unfollowUser = (aut_id) => {
    return topLine({
        url: `/app/v1_0/user/followings/${aut_id}`,
        method: 'delete'
    })
}

//修改头像
export const editAvatar = (fd) => {
    return topLine({
        url: '/app/v1_0/user/photo',
        method: 'patch',
        headers: {
            "Content-Type": 'multipart/form-data'
        },
        data: fd
    })
}

//编辑用户资料
export const editUserInfo = params => {
    return topLine({
        url: '/app/v1_0/user/profile',
        method: 'patch',
        data: params
    })
}