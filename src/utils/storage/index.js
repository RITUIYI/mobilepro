const USER_INFO = 'userInfo'

//设置token
export const setUser = (data) => {
    window.localStorage.setItem(
        USER_INFO,
        JSON.stringify(data)
    );
}
//取出token
export const getUser = () => {
    return JSON.parse(window.localStorage.getItem(USER_INFO))
}

//清除user信息
export const removeUser = () => {
    return window.localStorage.removeItem(USER_INFO);
}

//设置用户id
export const setUserId = (data) => {
    window.localStorage.setItem('userId', JSON.stringify(data))
}
//取出用户id
export const getUserId = () => {
    return JSON.parse(window.localStorage.getItem('userId'));
}

//储存用户详细信息
export const serUserInfo = (data) => {
    window.localStorage.setItem('userDetail', JSON.stringify(data));
}

//修改用户详细信息
export const setUserDetail = ({ name, intro, gender, birthday }) => {
    let user = getUserInfo();
    user.name = name;
    user.intro = intro;
    user.gender = gender;
    user.birthday = birthday;
    console.log(user);

    serUserInfo(user);
    return;
}

//获取用户详细信息
export const getUserInfo = () => {
    return JSON.parse(window.localStorage.getItem('userDetail'));
}

//在没有登陆的状态下  储存用户编辑后的频道数据
export const userChannelUnAuth = (channels) => {
    window.localStorage.setItem('offLineChannel', JSON.stringify(channels));
}
//不登录 获取本地频道列表
export const getoffLineChannel = () => {
    return JSON.parse(window.localStorage.getItem('offLineChannel'));
}

//储存收藏列表
export const setCollectList = (collectList) => {
    window.localStorage.setItem('collectList', JSON.stringify(collectList));
}

//离线状态下 读取缓存中的收藏列表
export const getCollectList = () => {
    return JSON.parse(window.localStorage.getItem('collectList'));
}

//储存历史记录列表
export const setHistoryList = (historyList) => {
    window.localStorage.setItem('historyList', JSON.stringify(historyList));
}

//离线状态下 读取缓存中的历史记录列表
export const getHistoryList = () => {
    return JSON.parse(window.localStorage.getItem('historyList'));
}