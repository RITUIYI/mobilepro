import { topLine } from '@/utils/http/'


//添加评论  或 回复评论
export const docomment = ({ content, target, art_id }) => {
    let data = {
        content,
        target
    }
    //有文章id则为回复评论
    if (art_id) {
        data.art_id = art_id
    }
    return topLine({
        url: '/app/v1_0/comments',
        method: 'post',
        data
    })
}

//点赞评论
export const dolikeComment = com_id => {
    return topLine({
        url: '/app/v1_0/comment/likings',
        method: 'post',
        data: {
            target: com_id
        }
    })
}

//取消评论点赞
export const cancelLikeComment = com_id => {
    return topLine({
        url: `/app/v1_0/comment/likings/${com_id}`,
        method: 'delete'
    })
}