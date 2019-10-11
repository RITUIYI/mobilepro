<template>
  <div>
    <van-nav-bar class="my-nav-bar nav-fixed" :title="$store.state.usrInfo.name">
      <van-icon @click="$router.push('/myaccount')" name="arrow-left" slot="left" />
    </van-nav-bar>
    <van-tabs @change="switchTabs" class="my-tab-container" v-model="active">
      <van-tab title="作品">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <van-cell v-for="item in list" :key="item.art_id.toString()">
            <div class="cell_container">
              <div class="cell_userInfo">
                <van-image class="avatar" round :src="$store.state.usrInfo.photo" />
                <div class="userDetail">
                  <span>{{item.aut_name}}</span>
                  <div>{{item.pubdate | timer()}}</div>
                </div>
              </div>
              <div class="content" @click='toArtcile(item.art_id)'>
                <p>{{item.title}}</p>
                <van-grid v-if="item.cover.type == 1" :border="false" :column-num="1">
                  <van-grid-item style="height: 120px">
                    <van-image fit="cover" style="height: 120px" :src="item.cover.images[0]" />
                  </van-grid-item>
                </van-grid>
              </div>
              <van-grid v-if="item.cover.type == 3" :border="false" :column-num="3">
                <van-grid-item v-for="(item, index) in item.cover.images" :key="index">
                  <van-image :src="item" />
                </van-grid-item>
              </van-grid>
              <van-grid class="dataCount" :column-num="3">
                <van-grid-item>
                  <van-icon name="comment-o" class="icon" />
                  <span>{{item.comm_count}}</span>
                </van-grid-item>
                <van-grid-item>
                  <van-icon name="good-job-o" class="icon" />
                  <span>{{item.like_count}}</span>
                </van-grid-item>
                <van-grid-item>
                  <van-icon name="star-o" class="icon" />
                  <span>{{ item.collect_count}}</span>
                </van-grid-item>
              </van-grid>
            </div>
          </van-cell>
        </van-list>
      </van-tab>
      <van-tab title="公告">
        <van-list v-model="loadingNot" :finished="finishedNot" finished-text="没有更多了" @load="onLoadNotice">
          <van-cell v-for="item in listNotice" :key="item.id" :title="item.title" />
        </van-list>
      </van-tab>
      <van-tab title="数据">数据</van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getUserWorks, getNotice } from "@/api/article.js";
export default {
  name: "works",
  data() {
    return {
      //当前活动tab栏
      active: 0,
      list: [],
      listNotice: [],
      loading: false,
      finished: false,
      loadingNot: false,
      finishedNot: false,
      page: 1,
      per_page: 10
    };
  },
  methods: {
    toArtcile(id) {
      this.$router.push(`/article/${id}`)
    },
    async onLoadNotice() {
      if (this.page == 1) {
        this.listNotice = [];
        this.finishedNot = false;
      }
      let params = {
        page: this.page,
        per_page: this.per_page
      };
      let list = await getNotice(params);
      this.listNotice.push(...list.data.data.results);
      this.loadingNot = false;

      if (this.page == Math.ceil(list.data.data.total_count / this.per_page)) {
        this.finishedNot = true;
      }
    },
    async onLoad() {
      console.log(this.active);
      let params = {
        page: this.page,
        per_page: this.per_page
      };
      //获取到用户作品
      let list = await getUserWorks(this.$store.state.usrInfo.id, params);
      this.page++;
      this.list.push(...list.data.data.results);
      this.loading = false;
      if (this.page >= Math.ceil(list.data.data.total_count / this.per_page)) {
        this.finished = true;
      }
    },
    switchTabs() {
      this.page = 1;
    }
  }
};
</script>

<style lang='less' scoped>
.my-tab-container {
  margin-top: 44px;
  margin-bottom: 56px;
  .van-list {
    background-color: #eee;
    .van-cell {
      margin-bottom: 10px;
    }
    .cell_container {
      .cell_userInfo {
        height: 50px;
        display: flex;
        justify-content: flex-start;
        .avatar {
          width: 50px;
          height: 50px;
        }
        .userDetail {
          margin-left: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          div {
            color: #ccc;
          }
        }
      }
      .content {
        display: flex;
        align-items: center;
        p {
          width: 800px;
        }
      }
      /deep/.van-grid-item__content {
        display: flex;
        justify-content: center;
        font-size: 20px;
        i {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>