<template>
  <div class="searchContainer">
    <div class="searchHistory" v-show="keyword.length == 0">
      <div class="history-title">
        <span>搜索记录</span>
        <div class="remove-history">
          <van-icon @click="isEdit=!isEdit" v-show="!isEdit" name="delete" />
          <van-tag
            @click="emptyHistory"
            v-show="isEdit"
            style="margin-right: 10px"
            color="#7232dd"
            size="medium"
            plain
          >清空</van-tag>
          <van-tag v-show="isEdit" size="medium" @click="isEdit=!isEdit" type="success">完成</van-tag>
        </div>
      </div>
      <van-cell-group v-if="historyList!=0">
        <van-cell
          @click="$emit('onSearch',item)"
          v-for="(item, index) in historyList"
          :key="index"
          :title="item"
        >
          <template slot="right-icon">
            <van-icon @click="deleteSingle(index)" v-show="isEdit" name="cross" />
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group v-else>
        <van-cell title="搜索记录为空"></van-cell>
      </van-cell-group>
    </div>
    <div v-show="keyword.length > 0">
      <van-cell-group v-for="(item, index) in highLight" :key="index">
        <van-cell icon="search" @click="$emit('onSearch',suggestionList[index])">
          <template slot="title">
            <span v-html="item"></span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import {
  getuserSeaHistory,
  getSuggestion,
  emptySearchHistory
} from "@/api/search.js";
export default {
  name: "searchPannel",
  props: ["keyword"],
  data() {
    return {
      isEdit: false,
      historyList: [],
      timerId: null,
      suggestionList: []
    };
  },
  methods: {
    //清空搜索记录
    async emptyHistory() {
      let empty = await emptySearchHistory();
      this.historyList = [];
    },
    //删除单条记录
    deleteSingle(index) {
      this.historyList.splice(index, 1);
    }
  },
  computed: {
    highLight() {
      let reg = new RegExp(this.keyword, "g");
      let listSug = this.suggestionList.map(item => {
        item = item.replace(
          reg,
          `<span style="color: red">${this.keyword}</span>`
        );
        return item;
      });
      return listSug;
    }
  },
  watch: {
    //检测keyword
    keyword() {
      //防抖
      if (this.timerId) {
        clearTimeout(this.timerId);
      }
      this.timerId = setTimeout(async () => {
        if (this.keyword.trim() == "") {
          return;
        }
        let suggestion = await getSuggestion(this.keyword.trim());
        this.suggestionList = suggestion.data.data.options;
      }, 300);
    }
  },
  async created() {
    try {
      let history = await getuserSeaHistory();
      this.historyList = history.data.data.keywords;
    } catch (error) {
      this.historyList = [];
    }
  }
};
</script>

<style lang='less' scoped>
.searchContainer {
  position: fixed;
  z-index: 999;
  background-color: #fff;
  width: 100%;
  height: 100%;
  top: 44px;
  left: 0;
  .searchHistory {
    .history-title {
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 16px;
      color: #000;
      position: relative;
      .remove-history {
        position: absolute;
        font-size: 20px;
        right: 20px;
        top: 0;
      }
    }
  }
}
</style>