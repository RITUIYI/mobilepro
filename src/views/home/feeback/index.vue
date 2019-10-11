<template>
  <van-dialog
    :closeOnClickOverlay="true"
    :beforeClose="beforeClose"
    v-model="feeback"
    :show-confirm-button="false"
  >
    <van-cell-group v-show="reportshow">
      <van-cell @click="unlikeArt" title="不喜欢此文章" />
      <van-cell @click="reportArt" title="举报" is-link />
      <van-cell @click="blockAut" title="拉黑" />
    </van-cell-group>
    <van-cell-group v-show="!reportshow">
      <van-cell icon="arrow-left" @click="reportshow=true" title="返回" />
      <van-cell
        v-for="(item, index) in feedbackList"
        :key="index"
        @click="doReport(index)"
        :title="item"
      />
    </van-cell-group>
  </van-dialog>
</template>

<script>
import { disLikeArt, reportArt } from "@/api/article.js";
import { blockAuthor } from "@/api/author.js";
export default {
  name: "feeback",
  props: ["feeback", "art_id", "aut_id", "artList"],
  data() {
    return {
      reportshow: true,
      feedbackList: [
        "其他问题",
        "标题党",
        "低俗色情",
        "错别字多",
        "旧闻重复",
        "广告软文",
        "内容不实",
        "内容不实",
        "涉嫌违法犯罪",
        "侵权"
      ]
    };
  },
  methods: {
    //执行举报
    async doReport(index) {
      try {
        let doreport = await reportArt(this.art_id, index);
        console.log(doreport);
        if(doreport.status == 201) {
          this.$toast.success('举报成功,我们将会认真审核');
          this.reportshow = true;
          this.$emit("closeDlg");
        }
        
      } catch (error) {
        if (error.response.status == 409) {
          this.$toast.fail('你已经举报过这篇文章了,请耐心等待审核结果')
        }
        
      }
    },
    //不喜欢文章
    async unlikeArt() {
      let unlike = await disLikeArt(this.art_id);
      if (unlike.status == 201) {
        let index = this.artList.findIndex(item => (item.art_id = this.art_id));
        this.artList.splice(index, 1);
        this.$toast.success("已为你移除该文章");
        this.reportshow = true;
        this.$emit("closeDlg");
      }
    },
    //拉黑作者
    async blockAut() {
      try {
        let blockAut = await blockAuthor(this.aut_id);
        if (blockAut.status == 201) {
          for (let i = this.artList.length - 1; i >= 0; i--) {
            if (this.artList[i].aut_id == this.aut_id) {
              this.artList.splice(i, 1);
            }
          }
          this.$toast.success("已经为你移除该作者的所有文章");
          this.reportshow = true;
          this.$emit("closeDlg");
        }
      } catch (error) {
        if (error.response.data.message == "User cannot blacklist self.") {
          this.$toast.fail("不能拉黑自己哦");
        }
      }
    },
    //举报文章
    reportArt() {
      this.reportshow = false;
    },
    //弹窗关闭前钩子
    beforeClose(action, done) {
      this.reportshow = true;
      this.$emit("closeDlg");
    }
  }
};
</script>

<style>
</style>