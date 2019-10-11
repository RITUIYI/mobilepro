<template>
  <van-cell>
    <div class="container-wrap">
      <div class="avatarCmd">
        <van-image round width="40px" height="40px" :src="item.aut_photo" />
      </div>
      <div class="right-wrap">
        <div class="userName">
          <span class="name">{{item.aut_name}}</span>
          <span>
            <van-icon
              @click="dolikeCom(item.com_id.toString(),item.is_liking)"
              :name="item.is_liking ? 'good-job' : 'good-job-o'"
            />
            <span>{{item.like_count}}</span>
          </span>
        </div>
        <p class="content_content" v-html="item.content"></p>
        <div class="detail">
          <span class="time">{{item.pubdate | timerMS()}}</span>
          <van-tag @click="doPop" round>{{item.reply_count}}条回复</van-tag>
        </div>
      </div>
    </div>
  </van-cell>
</template>

<script>
import { dolikeComment, cancelLikeComment } from "@/api/comment.js";
export default {
  name: "commentBlock",
  props: ["item"],
  data() {
    return {
      allowClick: true
    };
  },
  methods: {
    doPop() {
      this.$emit("reply", true, this.item);
    },
    //点赞评论
    async dolikeCom(com_id, like_status) {
      // if (this.$store.state.usrInfo.id == aut_id) {
      //   this.$toast("不能给自己的评论点赞哦");
      //   return;
      // }
      //取消点赞
      if (this.allowClick) {
        this.allowClick = false;
        if (like_status) {
          let cancelLike = await cancelLikeComment(com_id);
          if (cancelLike.status == 204) {
            this.$emit("doLikeCount", this.item.like_count - 1);
            this.$emit("dolikeOrCancel", false);
            this.allowClick = true;
          }
        } else {
          //点赞
          let likeCom = await dolikeComment(com_id);
          if (likeCom.status == 201) {
            this.$emit("doLikeCount", this.item.like_count + 1);
            this.$emit("dolikeOrCancel", true);
            this.allowClick = true;
          }
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.container-wrap {
  display: flex;
  .right-wrap {
    padding-left: 10px;
    flex: 1;
    .userName {
      display: flex;
      justify-content: space-between;
      span {
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          font-size: 20px;
        }
      }
      .name {
        color: #3195f9;
      }
    }
    .content_content {
      font-size: 18px;
      width: 100%;
      word-wrap: break-all;
      img {
        max-width: 100%;
      }
    }
    .detail {
      display: flex;
      align-content: center;
      .time {
        font-size: 12px;
        padding-right: 20px;
      }
      .van-tag {
        line-height: 26px;
        box-sizing: border-box;
        padding: 0 6px;
        letter-spacing: 1px;
      }
    }
  }
}
</style>