<template>
  <div>
    <div class="my-nav-bar">
      <van-search placeholder="请输入搜索关键词" v-model="keyword" />
    </div>
    <div class="my-home-tab">
      <van-tabs @click="switchChannel">
        <van-tab v-for="channel in channel_list" :key="channel.id" :title="channel.name">
          <van-list>
            <van-cell v-for="art in recommandArt" :key="art.art_id" :title="art.title" />
          </van-list>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { getChannelList, getRecommand } from "@/utils/http/";
export default {
  name: "home",
  data() {
    return {
      keyword: "",
      channel_list: [],
      recommandArt: [],
      getRecommandParams: {
        channel_id: "2",
        timestamp: new Date().getTime(),
        with_top: 1
      }
    };
  },
  methods: {
    async switchChannel(index, title) {
      let channel = this.channel_list.find(item => {
        return item.name == title;
      });
      this.getRecommandParams.channel_id = channel.id;
      let recommandArt = await getRecommand(this.getRecommandParams);
      this.recommandArt = [...recommandArt.data.data.results];
    }
  },
  async created() {
    let channel_list = await getChannelList();
    this.channel_list = channel_list.data.data.channels;

    let recommandArt = await getRecommand(this.getRecommandParams);
    this.recommandArt = recommandArt.data.data.results;
  }
};
</script>

<style lang='less' scoped>
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
</style>