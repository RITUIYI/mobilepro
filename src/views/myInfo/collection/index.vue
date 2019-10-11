<template>
  <div>
    <van-nav-bar class="my-nav-bar nav-fixed" title="收藏/历史">
      <van-icon @click="$router.push('/myaccount')" name="arrow-left" slot="left" />
    </van-nav-bar>
    <van-tabs @change="switchTab" class="my-collectlist" v-model="active">
      <van-tab title="我的收藏">
        <van-pull-refresh v-model="isRefresh" @refresh="onCollectRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoadCollect"
          >
            <van-cell v-for="(item,index) in collectList" :key="item.art_id.toString()">
              <div>
                <p>{{item.title}}</p>
                <p class="author">{{item.aut_name}}</p>
                <div class="art-detail">
                  <span>评论数 {{item.comm_count}}</span>
                  <span>{{item.pubdate | timeFormat()}}</span>
                </div>
                <van-grid :column-num="3">
                  <van-grid-item>
                    <van-icon name="comment-o" class="icon" />评论
                  </van-grid-item>
                  <van-grid-item @click="dolikeArt(item.art_id,item.is_liking,index)">
                    <van-icon v-if="!item.is_liking" name="good-job-o" class="icon" />
                    <van-icon v-else name="close" class="icon" />
                    <span>{{item.is_liking ? '取消点赞' : '点赞'}}</span>
                  </van-grid-item>
                  <van-grid-item @click="cancelCollection(item.art_id,index)">
                    <van-icon name="star-o" class="icon" />取消收藏
                  </van-grid-item>
                </van-grid>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="我的历史">
        <van-pull-refresh v-model="isRefresh" @refresh="onHistoryRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoadHistory"
          >
            <van-cell v-for="(item,index) in historyList" :key="item.art_id.toString()">
              <div>
                <p>{{item.title}}</p>
                <p class="author">{{item.aut_name}}</p>
                <div class="art-detail">
                  <span>评论数 {{item.comm_count}}</span>
                  <span>{{item.pubdate | timeFormat()}}</span>
                </div>
                <van-grid :column-num="3">
                  <van-grid-item @click='toArtcile(item.art_id)'>
                    <van-icon name="comment-o" class="icon" />评论
                  </van-grid-item>
                  <van-grid-item @click="dolikeArt(item.art_id,item.is_liking,index)">
                    <van-icon v-if="!item.is_liking" name="good-job-o" class="icon" />
                    <van-icon v-else name="close" class="icon" />
                    {{item.is_liking ? '取消点赞' : '点赞'}}
                  </van-grid-item>
                  <van-grid-item @click="collect(item.art_id,index)">
                    <van-icon v-if="!item.hasOwnProperty('isCollect')" name="star-o" class="icon" />
                    <van-icon v-else name="star" class="icon" />收藏
                  </van-grid-item>
                </van-grid>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import {
  collectArt,
  userCollection,
  cancelLike,
  likeArt,
  cancelCollect,
  userReadHistory
} from "@/api/article.js";
import {
  setCollectList,
  getCollectList,
  setHistoryList,
  getHistoryList
} from "@/utils/storage/";
export default {
  name: "collect",
  data() {
    return {
      active: 0,
      loading: false,
      finished: false,
      page: 1,
      per_page: 10,
      collectList: [],
      historyList: [],
      isRefresh: false
    };
  },
  methods: {
    toArtcile(id) {
      this.$router.push(`/article/${id}`)
    },
    //tab栏切换
    switchTab() {
      //重置页码
      this.page = 1;
      this.finished = false;
    },
    //获取收藏列表
    async getCollect() {
      try {
        let collect = await userCollection({
          page: this.page,
          per_page: this.per_page
        });
        this.page++;
        this.collectList.push(...collect.data.data.results);
        this.loading = false;
        if (
          this.page >= Math.ceil(collect.data.data.total_count / this.per_page)
        ) {
          this.finished = true;
        }
        setCollectList(this.collectList);
      } catch (error) {
        this.historyList = getHistoryList();
        this.collectList = getCollectList();
        this.loading = false;
        this.finished = true;
      }
    },
    //收藏列表加载事件
    async onLoadCollect() {
      this.getCollect();
    },
    //收藏列表刷新事件
    onCollectRefresh() {
      this.page = 1;
      this.collectList = [];
      this.getCollect();
      this.isRefresh = false;
    },
    //获取历史列表
    async getHistory() {
      try {
        let history = await userReadHistory({
          page: this.page,
          per_page: this.per_page
        });
        this.page++;
        this.historyList.push(...history.data.data.results);
        this.loading = false;
        if (
          this.page == Math.ceil(history.data.data.total_count / this.per_page)
        ) {
          this.finished = true;
        }
        setHistoryList(this.historyList);
      } catch (error) {
        this.historyList = getHistoryList();
        this.loading = false;
        this.finished = true;
      }
    },
    //历史列表加载事件
    async onLoadHistory() {
      this.getHistory();
    },
    //历史列表刷新事件
    onHistoryRefresh() {
      this.page = 1;
      this.historyList = [];
      this.getHistory();
      this.isRefresh = false;
    },
    //点赞操作
    async dolikeArt(id, status, index) {
      //如果是点赞状态
      if (status) {
        //取消点赞
        let cancelLikest = await cancelLike(id);
        if (cancelLikest.status == 204) {
          this.$toast.success("取消点赞成功");
          this.$set(this.collectList[index], "is_liking", false);
        }
      } else {
        //如果是非点赞状态 进行点赞
        let like = await likeArt(id);
        if (like.status == 201) {
          this.$toast.success("点赞成功");
          this.$set(this.collectList[index], "is_liking", true);
        }
      }
    },
    //取消收藏操作
    async cancelCollection(id, index) {
      let collect = await cancelCollect(id);
      if (collect.status == 204) {
        this.$toast.success("取消收藏成功");
        this.collectList.splice(index, 1);
      }
    },
    //收藏文章
    async collect(id, index) {
      let collect = await collectArt(id);
      if (collect.status == 201) {
        this.$toast.success("收藏成功");
        this.$set(this.historyList[index], "isCollect", true);
      }
    }
  }
};
</script>

<style lang='less' scoped>
.my-collectlist {
  margin-top: 44px;
  margin-bottom: 56px;
  .van-list {
    background-color: #eee;
    .van-cell {
      margin-bottom: 10px;
      .author {
        color: #ccc;
      }
      .art-detail {
        font-size: 12px;
        padding-left: 20px;
        text-align: left;
        color: #ccc;
        span {
          margin-right: 20px;
        }
        .van-icon {
          float: right;
          font-size: 16px;
          margin-right: 20px;
        }
      }
      .icon {
        font-size: 20px;
        margin-bottom: 5px;
      }
    }
  }
}
</style>