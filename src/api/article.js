import { topLine } from '@/utils/http/'

//不喜欢文章
export const disLikeArt = (art_id) => {
    return topLine.post('/app/v1_0/article/dislikes', {
        target: art_id
    })
}

//举报文章
export const reportArt = (art_id, type) => {
    return topLine.post('/app/v1_0/article/reports', {
        target: art_id,
        type
    })
}

//点赞文章
export const likeArt = (art_id) => {
    return topLine.post('/app/v1_0/article/likings', {
        target: art_id
    })
}

//取消点赞
export const cancelLike = (art_id) => {
    return topLine.delete(`/app/v1_0/article/likings/${art_id}`)
}

//收藏文章
export const collectArt = (art_id) => {
    return topLine.post('/app/v1_0/article/collections', {
        target: art_id
    })
}

//取消收藏
export const cancelCollect = (art_id) => {
    return topLine.delete(`/app/v1_0/article/collections/${art_id}`)
}

//获取收藏列表
export const userCollection = (params) => {
    return topLine.get('/app/v1_0/article/collections', {
        params
    })
}

//获取历史列表
export const userReadHistory = (params) => {
    return topLine.get('/app/v1_0/user/histories', { params });
}

//获取用户文章列表
export const getUserWorks = (aut_id, params) => {
    return topLine.get(`/app/v1_0/users/${aut_id}/articles`, {
        params
    })
}

//获取系统公告列表
export const getNotice = (params) => {
    return topLine.get('/app/v1_0/announcements', {
        params
    })
}

//获取新闻文章详情
export const getArtcileDetail = (id) => {
    return topLine.get(`/app/v1_0/articles/${id}`);
}

//获取文章评论
export const getArtcileComment = ({ id, offset, limit, type }) => {
    let params = {
        type,
        source: id,
        limit
    }
    if (offset) {
        params.offset = offset;
    }
    return topLine.get(`/app/v1_0/comments`, {
        params
    })
}