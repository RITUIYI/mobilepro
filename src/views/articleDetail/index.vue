<template>
  <div>
    <van-nav-bar class="my-nav-bar nav-fixed" @click-left="backup" left-arrow>
      <van-icon name="ellipsis" slot="right" />
    </van-nav-bar>
    <div class="article-container">
      <!-- 文章标题 -->
      <h4
        style="margin-left: 20px; font-size: 30px; word-wrap:break-word;box-sizing: border-box"
      >{{artData.title}}</h4>
      <!-- 作者信息 -->
      <autinfo></autinfo>
      <p class="content" v-html="artData.content"></p>
      <div style="padding: 0 10px;">
        <h6 style="margin: 10px; font-size: 20px">猜你喜欢</h6>
        <van-row>
          <van-col class="like" span="12">猜你喜欢</van-col>
          <van-col class="like" span="12">猜你喜欢</van-col>
          <van-col class="like" span="12">猜你喜欢</van-col>
          <van-col class="like" span="12">猜你喜欢</van-col>
          <van-col class="like" span="12">猜你喜欢</van-col>
          <van-col class="like" span="12">猜你喜欢</van-col>
        </van-row>
      </div>
      <div class="operation">
        <div>
          <van-tag round type="success">
            <van-icon name="good-job-o" />
            <span>点赞</span>
          </van-tag>
        </div>
        <div>
          <van-tag round type="danger">
            <van-icon name="close" />
            <span>不喜欢</span>
          </van-tag>
        </div>
      </div>
      <!-- 评论区 -->
      <div class="comment_list">
        <van-list
          v-model="loadingCmd"
          :finished="finishedCmd"
          finished-text="没有更多了"
          @load="onLoadCmd"
        >
          <commentblock
            @reply="doReply"
            v-for="(item,index) in commentList"
            :key="index"
            :item="item"
            @dolikeOrCancel="$set(commentList[index],'is_liking',$event)"
            @doLikeCount="$set(commentList[index],'like_count',$event)"
          ></commentblock>
        </van-list>
      </div>
    </div>
    <!-- 评论框 -->
    <commentbar
      @addComment="commentList.unshift($event);total_count++"
      :target="art_id"
      :total_count="total_count"
    ></commentbar>
    <!-- 回复评论 弹出层 -->
    <van-popup @close="closePop" v-model="replyShow" position="bottom" :style="{ height: '20%' }">
      <commentcell
        v-if="replyShow"
        :finished="finished"
        @isfinished="finished=$event"
        :art_id="art_id"
        :comment="commentSelected"
        :comment_commentList="comment_commentList"
        @comment_comment="comment_commentList.push(...$event)"
      ></commentcell>
    </van-popup>
  </div>
</template>

<script>
import autinfo from "./autInfo/";
import commentcell from "./com_comment/";
import commentblock from "./commentBlock/";
import commentbar from "./commentBar/";
import { getArtcileDetail, getArtcileComment } from "@/api/article.js";
export default {
  name: "detail",
  components: {
    autinfo,
    commentblock,
    commentbar,
    commentcell
  },
  data() {
    return {
      comment_commentList: [],
      commentList: [],
      artData: {},
      total_count: 0,
      art_id: "",
      loadingCmd: false,
      finishedCmd: false,
      art_id: "",
      offset: null,
      limit: 10,
      replyShow: false,
      commentSelected: {},
      finished: false
    };
  },
  methods: {
    //关闭弹出层
    closePop() {
      this.finished = false;
      this.comment_commentList = [];
    },
    //回复评论
    doReply(replyShowStatus, commentSelected) {
      this.replyShow = replyShowStatus;
      this.commentSelected = commentSelected;
    },
    //返回上一级
    backup() {
      //回退至上一个路由
      this.$router.back();
    },
    //评论列表
    async onLoadCmd() {
      let params = {
        id: this.art_id,
        offset: this.offset,
        limit: this.limit,
        type: "a"
      };
      let commentList = await getArtcileComment(params);
      console.log(commentList);
      
      this.total_count = commentList.data.data.total_count;
      //更新评论列表
      this.commentList.push(...commentList.data.data.results);
      //获取评论偏移量
      this.offset = commentList.data.data.last_id;
      this.loadingCmd = false;
      //如果到底了 将finish变为true
      if (commentList.data.data.last_id == commentList.data.data.end_id) {
        this.finishedCmd = true;
      }
    }
  },
  async created() {
    let art_id = this.$route.params.id;
    this.art_id = art_id;
    let art = await getArtcileDetail(art_id);
    this.artData = art.data.data;
  }
};
</script>

<style lang='less' scoped>
.article-container {
  box-sizing: border-box;
  width: 100%;
  margin-top: 44px;
  margin-bottom: 50px;

  /deep/.content {
    box-sizing: border-box;
    font-size: 14px;
    padding: 0 20px;
    word-wrap: break-word;
    word-break: break-word;
    overflow: hidden;
    table {
      width: 100% !important;
    }
    img {
      max-width: 100% !important;
      height: auto !important;
    }
    code {
      width: 100%;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
  .like {
    padding-left: 10px;
    font-size: 14px;
  }
  .operation {
    margin: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    > div {
      padding: 0 10px;
      .van-tag {
        width: 60px;
        height: 20px;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        .van-icon {
          margin-right: 5px;
        }
      }
    }
  }
}
.van-popup {
  height: 70% !important;
}
</style>