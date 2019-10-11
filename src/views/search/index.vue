<template>
  <div>
    <van-nav-bar class="my-nav-bar nav-fixed" title="搜索结果">
      <van-icon @click="backToHome" name="arrow-left" slot="left" />
    </van-nav-bar>
    <div class="list">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="item in list" :key="item.art_id">
          <div>
            <p>{{item.aut_name}}</p>
            <p>{{item.title}}</p>
            <van-grid :column-num="3">
              <van-grid-item @click='toArtcile(item.art_id)'>评论</van-grid-item>
              <van-grid-item @click="dolikeArt(item.art_id)">{{item.is_liking ? '取消点赞' : '点赞'}}</van-grid-item>
              <van-grid-item @click="doCollect(item.art_id)">收藏</van-grid-item>
            </van-grid>
          </div>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import { getSearchResulte } from "@/api/search.js";
import { likeArt, collectArt } from "@/api/article.js";
export default {
  name: "search",
  data() {
    return {
      loading: false,
      finished: false,
      keyword: "",
      page: 1,
      per_page: 20,
      list: []
    };
  },
  methods: {
    toArtcile(id) {
      this.$router.push(`/article/${id}`)
    },
    //收藏文章
    async doCollect(id) {
      if (this.$store.state.token) {
        try {
          let collect = await collectArt(id);
          if (collect.status == 201) {
            this.$toast.success("收藏成功");
          }
        } catch (error) {
        //   this.$toast.fail("登录状态过期");
        }
      } else {
        this.$toast.fail("请先登录");
      }
    },
    //点赞文章
    async dolikeArt(id) {
      if (this.$store.state.token) {
        try {
          let likeArtData = await likeArt(id);
          if (likeArtData.status == 201) {
            this.$toast.success("点赞成功");
          }
        } catch (error) {
        //   this.$toast.fail("登录状态过期");
        }
      } else {
        this.$toast.fail("请先登录");
      }
    },
    //返回首页
    backToHome() {
      this.$router.push("/home");
    },
    async onLoad() {
      if (this.page == 1) {
        this.keyword = this.$route.params.keyword;
      }
      let params = {
        page: this.page,
        per_page: this.per_page,
        q: this.keyword
      };
      this.page++;
      let result = await getSearchResulte(params);
      this.list.push(...result.data.data.results);
      this.loading = false;
      if (
        this.page == Math.ceil(result.data.data.total_count / this.per_page)
      ) {
        this.finished = true;
        this.$toast("已经到底了");
      }
      //   this.list
    }
  }
};
</script>

<style lang='less' scoped>
.list {
  margin-top: 44px;
  margin-bottom: 56px;
  .van-list {
    background-color: #eee;
    .van-cell {
      margin-bottom: 10px;
    }
  }
}
</style>