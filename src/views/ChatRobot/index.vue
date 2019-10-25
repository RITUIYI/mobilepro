<template>
  <div class="container-chat">
    <van-nav-bar title="小西同学" class="my-nav-bar nav-fixed" @click-left="$router.back()" left-arrow></van-nav-bar>
    <div class="chat-wrapper">
      <ul class="ul-wrap">
        <li class="content_xi" v-for="(item, index) in chatHistory" :key="index">
          <div :class="{'content_user': item.user}">
            <!-- <van-image style="width: 30px; height: 30px" :src="$store.state.usrInfo.photo"></van-image> -->
            <span class="name">{{item.name}}</span>
            <span :class="{'robot': !item.user}" class="content">{{item.msg}}</span>
          </div>
          <p>{{item.timestamp | timerMS()}}</p>
        </li>
      </ul>
    </div>
    <div class="msg_bar">
      <van-cell-group>
        <van-field @keyup.enter="sendMsg" v-model="msg" center clearable placeholder="请输入内容">
          <van-button slot="button" size="media" type="primary">发送</van-button>
        </van-field>
      </van-cell-group>
    </div>
    <van-dialog @confirm="confirm" v-model="show" title="请输入用户名" show-cancel-button>
      <van-field @keyup.enter="sendMsg" v-model="name" center clearable placeholder="请输入名字" />
    </van-dialog>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  name: "chatRobot",
  data() {
    return {
      show: false,
      msg: "",
      chatHistory: [],
      socket: "",
      name: ""
    };
  },
  methods: {
    confirm() {
      window.localStorage.setItem("offLineName", this.name);
    },
    sendMsg() {
      if (this.name == "") {
        this.show = true;
        return;
      }
      let timestamp = Date.now();
      if (this.$store.state.token) {
        this.socket.emit("message", {
          token: this.$store.state.token.token,
          msg: this.msg,
          timestamp: timestamp
        });
        // 给服务器发消息
        this.chatHistory.push({
          user: true,
          name: this.$store.state.usrInfo.name,
          msg: this.msg,
          timestamp
        });
        this.msg = "";
      } else {
        this.socket.emit("message", {
          name: this.name,
          msg: this.msg,
          timestamp: timestamp
        });
        // 给服务器发消息
        this.chatHistory.push({
          user: true,
          name: this.name,
          msg: this.msg,
          timestamp
        });
        this.msg = "";
      }
    }
  },
  created() {
    // this.socket = io("ws://liucanhong.club:81");
    this.socket = io("ws://liucanhong.club:81");
    // 监听服务器的消息
    this.socket.on("message", msg => {
      // 把服务器广播的消息添加到ul里
      // msg.msg.timestamp = msg.msg.timestamp * 1000;
      // msg.msg.name = "小西西";
      // console.log('收到');

      // this.chatHistory.push(msg);
      msg.timestamp = msg.timestamp * 1000;
      msg.name = "小西西";
      this.chatHistory.push(msg);
    });
    if (this.$store.state.token) {
      this.name = this.$store.state.usrInfo.name;
      try {
        let history = JSON.parse(
          window.localStorage.getItem("onelineLineChatHistory")
        );
        if (history) {
          this.chatHistory = history;
        }
      } catch (error) {}
      return;
    } else {
      let name = window.localStorage.getItem("offLineName");
      if (name) {
        this.name = name;
        try {
          let history = JSON.parse(
            window.localStorage.getItem("offLineLineChatHistory")
          );
          console.log(history);

          if (history) {
            console.log(222);

            this.chatHistory = history;
          }
        } catch (error) {
          console.log(333);
        }
        return;
      }
      this.show = true;
    }
  },
  destroyed() {
    if (this.$store.state.token) {
      window.localStorage.setItem(
        "onelineLineChatHistory",
        JSON.stringify(this.chatHistory)
      );
    } else {
      window.localStorage.setItem(
        "offLineLineChatHistory",
        JSON.stringify(this.chatHistory)
      );
    }
  }
};
</script>

<style lang='less' scoped>
.my-nav-bar {
  background-color: #2ba245;
}
.content_xi {
  text-align: left;
}
.robot {
  background-color: #fff !important;
}
.content_user {
  flex-direction: row-reverse;
}
.container-chat {
  height: 100%;
  .chat-wrapper {
    .ul-wrap {
      padding: 0 10px;
      padding-top: 10px;
      background-color: #f5f5f5;
      overflow: auto;
      margin-top: 46px;
      box-sizing: border-box;
      height: 570px;
      padding-bottom: 15px;
      div {
        display: flex;
        align-items: flex-start;
        .name {
          font-size: 14px;
          padding: 10px 10px 0;
        }
        .content {
          max-width: 200px;
          padding: 5px 8px;
          border-radius: 10px;
          border: 1px solid #ccc;
          background-color: #98e165;
          font-size: 16px;
        }
      }
      p {
        text-align: center;
        font-size: 12px;
        margin: 0;
        margin-bottom: 10px;
      }
    }
  }
}
.msg_bar {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  /deep/.van-cell-group {
    .van-cell {
      padding: 0;
      background-color: #ccc;
      .van-cell__value {
        background-color: #fff;
      }
    }
  }
  /deep/.van-field__body {
    height: 100%;
    display: flex;
    /deep/.van-field__control {
      height: 48px;
      text-indent: 1em;
      width: 80%;
      //   border: 1px solid #ccc;
    }
    /deep/.van-field__button {
      flex: 1;
      .van-button {
        width: 100%;
      }
    }
  }
}
</style>