<template>
  <div class="cell_userInfo">
    <van-image class="avatar" round :src="$store.state.usrInfo.photo" />
    <div class="userDetail">
      <span>{{aut_data.aut_name}}</span>
      <div>{{aut_data.pubdate | timeFormat()}}</div>
    </div>
    <div>
      <van-tag @click="doFollow" round size="large" type="primary">
        <van-icon name="plus">{{aut_data.is_followed ? "取关" : "关注"}}</van-icon>
      </van-tag>
    </div>
  </div>
</template>

<script>
import { getArtcileDetail } from "@/api/article.js";
import { followUser, unfollowUser } from "@/api/author.js";

export default {
  name: "autInfo",
  data() {
    return {
      aut_data: {},
      art_id: ""
    };
  },
  methods: {
    async doFollow() {
      //取消关注
      if (this.aut_data.is_followed) {
        let unfollow = await unfollowUser(this.aut_data.aut_id);
        if(unfollow.status == 204) {
          this.$set(this.aut_data, "is_followed", false);
        }
      } else {
        //关注用户
        try {
          let follow = await followUser(this.aut_data.aut_id);
          if(follow.status == 201) {
            this.$set(this.aut_data, "is_followed", true);
          }
        } catch (error) {
          if (error.response.status == 400) {
            this.$toast("不能关注自己哦");
          }
        }
      }
    }
  },
  async created() {
    this.art_id = this.$route.params.id;
    let art = await getArtcileDetail(this.art_id);
    this.aut_data = art.data.data;
  }
};
</script>

<style lang='less' scoped>
.cell_userInfo {
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  display: flex;
  margin: 20px 0;
  padding-left: 20px;
  justify-content: flex-start;
  align-items: center;
  .avatar {
    width: 50px;
    height: 50px;
  }
  .userDetail {
    box-sizing: border-box;
    width: 200px;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    font-size: 14px;
    div {
      color: #ccc;
    }
  }
  /deep/.van-tag {
    .van-icon {
      margin-right: 5px;
    }
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
  }
}
</style>