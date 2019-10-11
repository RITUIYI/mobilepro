<template>
  <div class="comment-bar">
    <van-cell-group>
      <van-field @keyup.enter="sendComment" v-model="comment" left-icon="edit" placeholder="写评论" />
    </van-cell-group>
    <div class="opreation">
      <div>
        <van-icon name="comment-o" />
        <i class="comment-count">{{total_count}}</i>
      </div>
      <div>
        <van-icon name="star-o" />
      </div>
      <div>
        <van-icon name="share" />
      </div>
    </div>
  </div>
</template>

<script>
import { docomment } from "@/api/comment.js";
export default {
  name: "commentBar",
  props: ["total_count", "art_id", "target"],
  data() {
    return {
      comment: ""
    };
  },
  methods: {
    async sendComment() {
      let data = {
        content: this.comment,
        target: this.target,
        art_id: this.art_id
      };
      let res = await docomment(data);
      //取出请求体
      let resObj = JSON.parse(res.config.data);
      //如果请求体中有 art_id参数 则说明是 评论回复 否则是评论文章
      let isComCom = resObj.hasOwnProperty("art_id");
      if (res.status == 201 && !isComCom) {
        //评论文章
        this.$emit("addComment", res.data.data.new_obj);
      } else if (res.status == 201 && isComCom) {
        //回复评论
        this.$emit("addComCom", res.data.data.new_obj);
      }
      this.$toast("评论发表成功");
      this.comment = "";
    }
  },
  created() {}
};
</script>

<style lang='less' scoped>
.comment-bar {
  background-color: #fff;
  display: flex;
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 1px solid #d8d8d8;
  /deep/.van-cell-group {
    height: 100%;
    width: 60%;
    .van-cell {
      .van-field__control {
        border-radius: 25px;
        background-color: #51cd41;
        height: 30px;
        text-indent: 1em;
      }
    }
  }
  .opreation {
    display: flex;
    width: 40%;
    > div {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      position: relative;
      .comment-count {
        position: absolute;
        right: 8px;
        top: 8px;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: #e12729;
        font-size: 12px;
        text-align: center;
        color: #fff;
        font-style: normal;
      }
    }
  }
  .comment_list {
    box-sizing: border-box;
    padding: 0 10px;
  }
}
</style>