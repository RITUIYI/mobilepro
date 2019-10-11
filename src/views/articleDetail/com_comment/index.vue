<template>
  <div class="comment_container">
    <div class="current_comment">
      <div class="title">当前评论</div>
      <commentblock :item="comment"></commentblock>
    </div>
    <div class="comment_list">
      <div class="title">评论回复</div>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <commentblock v-for="(comment, index) in comment_commentList" :key="index" :item="comment"></commentblock>
      </van-list>
    </div>
    <commentbar @addComCom='comment_commentList.unshift($event)' :target='comment.com_id.toString()' :art_id='art_id'></commentbar>
  </div>
</template>

<script>
import commentblock from "../commentBlock/";
import commentbar from "../commentBar/";
import { getArtcileComment } from "@/api/article.js";
export default {
  name: "comment_comment",
  props: ["comment", "art_id", "finished", "comment_commentList"],
  components: {
    commentblock,
    commentbar
  },
  data() {
    return {
      loading: false,
      offset: null
    };
  },
  methods: {
    async onLoad() {
      let params = {
        type: "c",
        id: this.comment.com_id.toString(),
        limit: 10,
        offset: this.offset
      };

      let comment = await getArtcileComment(params);
      this.offset = comment.data.data.last_id;
      this.$emit('comment_comment',comment.data.data.results)
      this.loading = false;
      if (comment.data.data.last_id == comment.data.data.end_id) {
        this.$emit("isfinished", true);
      }
    }
  }
};
</script>

<style lang='less' scoped>
.comment_container {
  .title {
    padding: 10px;
    font-size: 16px;
    color: #666;
  }
  .current_comment {
    border-bottom: 1px solid #ccc;
  }
  .comment_list {
    margin-bottom: 56px;
  }
}
</style>