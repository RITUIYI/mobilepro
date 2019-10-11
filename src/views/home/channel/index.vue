<template>
  <van-popup class="channel-mannerage" v-model="popupisShow">
    <van-row>
      <van-col span="12">
        <van-icon @click="close" class="close" name="cross" />
      </van-col>
    </van-row>
    <van-row>
      <van-col span="12">我的频道</van-col>
      <van-col style="text-align: right" span="12">
        <van-tag size="large" @click="doEditChannel" plain color="#f2826a">{{isEdit ? '完成' : '编辑'}}</van-tag>
      </van-col>
    </van-row>
    <van-row class="my-channel-list">
      <van-col span="6" v-for="(channle,index) in selectedchan" :key="channle.id">
        <van-icon
          v-show="isEdit&&index!=0"
          class="remove-channel"
          @click="removeChannel(index)"
          name="clear"
        />
        <van-button
          @click="$emit('update:activeChannel',index)"
          :class="{'ischecked': index==activeChannel}"
          color="#7232dd"
          plain
          size="large"
        >{{channle.name}}</van-button>
      </van-col>
    </van-row>
    <van-row>
      <van-col span="12">全部频道</van-col>
    </van-row>
    <van-row class="all-channel-list">
      <van-col span="6" v-for="(channle) in surplusList" :key="channle.id">
        <van-icon @click="addChannel(channle)" v-show="isEdit" class="add-channel" name="add" />
        <van-button :disabled="!isEdit" color="#7232dd" plain size="large">{{channle.name}}</van-button>
      </van-col>
    </van-row>
  </van-popup>
</template>

<script>
import { getAllChannelList, editUserChannel } from "@/api/channle.js";
import { userChannelUnAuth } from "@/utils/storage/";
export default {
  name: "channel",
  props: ["popupisShow", "channel_list", "activeChannel"],
  data() {
    return {
      da: {name: 'jack'},
      //所有频道列表数据
      allList: [],
      //编辑状态
      isEdit: false,
      //暂存频道编辑数据  如果没有保存 关闭编辑页面会丢失
      selectedchan: []
    };
  },
  model: {
    //管理频道页面显示状态
    prop: "popupisShow",
    event: "change"
  },
  methods: {
    //编辑/完成事件
    async doEditChannel() {
      this.isEdit = !this.isEdit;
      if (this.isEdit == false) {
        //点击完成
        let userToken = this.$store.state.token;
        //如果用户登录了 则发送请求提交修改数据
        if (userToken) {
          //去除推荐频道
          let channelList = this.selectedchan.filter((item, index) => {
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
          //发送编辑频道请求
          let res = await editUserChannel(channels);
          //把修改后的频道列表 上传给父组件
          this.$emit("updateChannel", this.selectedchan);
          userChannelUnAuth(this.selectedchan
          )
        } else {
          userChannelUnAuth(this.selectedchan);
          //把修改后的频道列表 上传给父组件
          this.$emit("updateChannel", this.selectedchan);
        }
      }
    },
    //添加频道
    addChannel(item) {
      this.selectedchan.push(item);
    },
    //移除已选频道
    removeChannel(index) {
      //如果只点击了移除频道 没点击保存 则不应该做任何变动
      this.selectedchan.splice(index, 1);
    },
    //关闭频道管理
    close() {
      //向父组件传值 关闭页面
      this.$emit("change", false);
      //给selectedchan重新赋值
      this.selectedchan = [...this.channel_list];
      this.isEdit = false;
    }
  },
  computed: {
    //显示 去除用户已选频道后的剩余频道列表
    surplusList() {
      //提取出用户已选频道的所有id作为一个数组
      let ids = this.selectedchan.map(item => item.id);
      //从所有频道列表中筛选出不包含 已选频道列表id的数据
      let surplusList = this.allList.filter(item => !ids.includes(item.id));
      return surplusList;
    }
  },
  //组件创建完成 获取全部频道列表数据
  async created() {
    let res = await getAllChannelList();
    this.allList = res.data.data.channels;
    this.selectedchan = [...this.channel_list];
  }
};
</script>

<style lang='less' scoped>
.channel-mannerage {
  padding: 20px;
  box-sizing: border-box;
  .close {
    font-size: 24px;
  }
  .van-col {
    height: 50px;
    position: relative;
    line-height: 50px;
    font-size: 16px;
    margin-bottom: 10px;
    padding: 5px;
    .van-button__text {
      font-size: 14px;
    }
  }
  .remove-channel,
  .add-channel {
    position: absolute;
    right: -4px;
    z-index: 1;
    color: tomato;
    top: -4px;
  }
  .ischecked {
    background-color: #cccccc;
    .van-button__text {
      color: tomato;
    }
  }
}
</style>