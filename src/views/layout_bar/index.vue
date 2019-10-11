<template>
  <div>
    <router-view></router-view>
    <div class="class-bottom">
      <van-tabbar v-model="active">
        <van-tabbar route>
          <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
          <van-tabbar-item replace to="/search" icon="comment-o">问答</van-tabbar-item>
          <van-tabbar-item replace to="/home" icon="video-o">视频</van-tabbar-item>
          <van-tabbar-item replace to="/myaccount" icon="manager-o">我的</van-tabbar-item>
        </van-tabbar>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import { getUser, getUserInfo } from "@/utils/storage/";
export default {
  name: "tabbar",
  data() {
    return {
      active: "home"
    };
  },
  created() {}
};
</script>

<style lang='less' scoped>
.class-bottom {
  z-index: 999;
}
</style>