import { topLine } from '@/utils/http/'

//获取用户搜索记录
export const getuserSeaHistory = () => {
    return topLine.get('/app/v1_0/search/histories')
}

//获取联想建议
export const getSuggestion = (q) => {
    return topLine.get('/app/v1_0/suggestion', {
        params: { q }
    })
}

//清空搜索记录
export const emptySearchHistory = () => {
    return topLine.delete('/app/v1_0/search/histories');
}

//获取搜索结果
export const getSearchResulte = (params) => {
    return topLine.get('/app/v1_0/search',{params});
}