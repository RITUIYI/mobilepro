<template>
  <div>
    <div class="nav-fixed my-nav-bar">
      <form action="/">
        <van-search
          style="width: 100%"
          @click="onFocus"
          placeholder="请输入搜索关键词"
          v-model="keyword"
          @search="onSearch(keyword)"
        />
      </form>
      <span
        @click="searchStauts=false;keyword=''"
        v-show="searchStauts"
        style="position: absolute; top: 12px; right: 20px; font-size: 18px; color: #fff;"
      >取消</span>
    </div>
    <searchpannel @onSearch="onSearch" :keyword="keyword" v-show="searchStauts"></searchpannel>
    <div class="my-home-tab">
      <van-tabs @change="switchChannel" v-model="activeindex">
        <van-tab v-for="channel in channel_list" :key="channel.id" :title="channel.name">
          <van-pull-refresh v-model="isPullLoading" @refresh="onRefresh">
            <van-list
              v-model="loading"
              error-text="请求失败，点击重新加载"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <div v-for="(art, index) in artList" :key="index">
                <van-cell @click="toArtcile(art.art_id)" :title="art.title">
                  <van-grid v-if="art.cover.type == 1" :border="false" :column-num="1">
                    <van-grid-item style="height: 120px">
                      <van-image fit="cover" style="height: 120px" :src="art.cover.images[0]" />
                    </van-grid-item>
                  </van-grid>
                </van-cell>
                <van-grid v-if="art.cover.type == 3" :border="false" :column-num="3">
                  <van-grid-item v-for="(item, index) in art.cover.images" :key="index">
                    <van-image :src="item" />
                  </van-grid-item>
                </van-grid>
                <div class="art-detail">
                  <span>{{art.aut_name}}</span>
                  <span>评论数 {{art.comm_count}}</span>
                  <span>{{art.pubdate | timeFormat()}}</span>
                  <van-icon @click="doFeeback(art.art_id,art.aut_id)" name="cross" />
                </div>
                <van-divider />
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
      <div class="my-tabicon" slot="nav-right">
        <van-icon name="wap-nav" @click="popupisShow=true" />
      </div>
      <!-- 双向绑定 -->
      <div v-if="popupisShow">
        <channel
          ref="channel_vue"
          :activeChannel.sync="activeindex"
          :channel_list="channel_list"
          @updateChannel="channel_list = $event"
          v-model="popupisShow"
        ></channel>
      </div>
    </div>
    <feeback
      @closeDlg="closeDlg"
      :art_id="art_id"
      :feeback="feeback"
      :artList="artList"
      :aut_id="aut_id"
    ></feeback>
  </div>
</template>

<script>
import channel from "./channel/";
import feeback from "./feeback/";
import searchpannel from "./searchPannel/";

import { getUserInfo, getGenderPhone, getUserId } from "@/api/author.js";
import {
  setUserId,
  getoffLineChannel,
  userChannelUnAuth,
  removeUser,
  getUserId as getUsrId,
  serUserInfo
} from "@/utils/storage/";
import {
  getChannelList,
  getRecommand,
  editUserChannel
} from "../../api/channle.js";
export default {
  name: "home",
  components: {
    channel,
    feeback,
    searchpannel
  },
  data() {
    return {
      //搜索栏
      searchStauts: false,

      //反馈状态
      feeback: false,
      art_id: "",
      aut_id: "",

      //弹出层状态
      popupisShow: false,
      isPullLoading: false,
      loading: false,
      finished: false,
      //当前tab栏下标
      activeindex: 0,
      keyword: "",
      //频道列表
      channel_list: [],
      //频道对应文章推荐数据
      artList: [],
      //请求参数
      getRecommandParams: {
        channel_id: 0,
        timestamp: Date.now(),
        with_top: 1
      },
      userInfo: {}
    };
  },
  methods: {
    toArtcile(id) {
      this.$router.push(`/article/${id}`);
    },
    //搜索事件
    onFocus() {
      this.searchStauts = true;
    },
    onSearch(key) {
      this.$router.push(`/search/${key}`);
    },
    //反馈事件
    doFeeback(art_id, aut_id) {
      this.feeback = true;
      this.art_id = art_id;
      this.aut_id = aut_id;
    },
    //关闭弹窗
    closeDlg() {
      this.feeback = false;
    },
    //下拉刷新
    async onRefresh() {
      this.isPullLoading = true;
      //重置当前时间戳
      this.getRecommandParams.timestamp = Date.now();
      let recommandArt = await getRecommand(this.getRecommandParams);
      this.artList.unshift(...recommandArt.data.data.results);
      this.isPullLoading = false;
    },
    //获取对应频道文章数据列表  下拉事件
    async getartList(id) {
      //给参数设置频道id
      this.getRecommandParams.channel_id = id;
      //设置当前时间戳
      this.getRecommandParams.timestamp -= 100;
      //发送请求获取数据
      let recommandArt = await getRecommand(this.getRecommandParams);
      this.artList.push(...recommandArt.data.data.results);
      //关闭加载动画
      this.loading = false;
      //如果数据为空 将finished 改为 true
      if (this.artList.length == 0) {
        this.finished = true;
      }
    },
    //列表加载事件
    onLoad() {
      // 异步更新数据
      this.getartList(this.getRecommandParams.channel_id);
    },
    //频道切换
    switchChannel(index, title) {
      //重置当前时间戳
      this.getRecommandParams.timestamp = Date.now();
      this.loading = true;
      //把结束状态切换为false
      this.finished = false;
      //清空新闻列表
      this.artList = [];
      //找出频道id
      let channel = this.channel_list.find(item => {
        return item.name == title;
      });
      //给参数中 的频道id赋值
      this.getRecommandParams.channel_id = channel.id;
      this.getartList(this.getRecommandParams.channel_id);
    }
  },
  async created() {
    let userToken = this.$store.state.token;
    let offLineChannel = getoffLineChannel();
    if (userToken || !offLineChannel) {
      //组件创建时 获取文章频道列表
      try {
        let channel_list = await getChannelList();
        this.channel_list = channel_list.data.data.channels;

        //合并本地频道数据
        if (offLineChannel) {
          let ids = this.channel_list.map(item => {
            return item.id;
          });
          let list = offLineChannel.filter(item => {
            return !ids.includes(item.id);
          });
          if (list.length != 0) {
            list.forEach(item => {
              this.channel_list.push(item);
            });
          }
        }

        //更新频道列表

        //去除推荐频道
        let channelList = this.channel_list.filter((item, index) => {
          return index > 0;
        });
        //把频道包装成API要求的参数格式
        let channels = channelList.map((item, index) => {
          return {
            id: item.id,
            seq: index + 1
          };
        });
        if (channelList.length == 0) {
          return this.$toast.fail("至少保留一个频道");
        }
        editUserChannel(channels);

        //设置当前时间戳
        this.getRecommandParams.timestamp = Date.now();

        //把当前频道列表储存到本地储存
        userChannelUnAuth(this.channel_list);
      } catch (error) {
        removeUser();
        this.$store.commit("removeToken");
        this.channel_list = getoffLineChannel();
      }
    } else {
      this.channel_list = getoffLineChannel();
    }
    console.log(userToken);

    if (userToken) {
      try {
        //获取当前用户ID
        let userId = await getUserId();
        //把用户ID保存至localStorage中
        setUserId(userId.data.data);
        //获取用户资料
        let userInfo = await getUserInfo(userId);
        let userGen = await getGenderPhone(userId);
        this.userInfo = userInfo.data.data;
        this.userInfo.birthday = userGen.data.data.birthday;
        this.userInfo.gender = userGen.data.data.gender;
        this.userInfo.mobile = userGen.data.data.mobile;
        this.$store.commit("setUsrInfo", this.userInfo);
        serUserInfo(this.userInfo);
      } catch (error) {}
    }
  }
};
</script>

<style lang='less' scoped>
.my-home-tab {
  margin-top: 88px;
  margin-bottom: 56px;
}
.my-nav-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  .van-search {
    width: 60%;
    padding: 0;
    border-radius: 15px;
    height: 30px;
  }
}
/deep/.van-tabs__wrap {
  box-sizing: border-box;
  width: 100%;
  z-index: 1;
  position: fixed;
  top: 44px;
  left: 0;
  padding-right: 50px;
  /deep/.van-tabs__nav {
    padding-right: 50px;
  }
}
.my-tabicon {
  width: 50px;
  background-color: #fff;
  text-align: center;
  position: fixed;
  top: 44px;
  height: 44px;
  right: 0;
  font-size: 36px;
  z-index: 2;
}
.new-type {
  display: flex;
  justify-content: center;
  flex-direction: column;
  .image-wrap {
    width: 100%;
    overflow: hidden;
    height: 100px;
    display: flex;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.new-type1 {
  display: flex;
  justify-content: center;
  align-items: center;
  .image-wrap {
    width: 100px;
    height: 100%;
    display: flex;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
/deep/.van-cell:not(:last-child)::after {
  border-bottom: 0 !important;
}
.van-cell__title {
  display: flex;
  align-items: center;
}
.van-popup {
  width: 100%;
  height: 100%;
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
</style>