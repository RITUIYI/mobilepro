<template>
  <div class="my-container">
    <div class="my-account-data">
      <div v-if="$store.state.token">
        <div class="userInfo">
          <div class="my-avatar">
            <van-image
              width="100%"
              height="100%"
              fit="fill"
              :src="$store.state.usrInfo.photo"
              @click="toUsrCenter"
            />
          </div>
          <div class="my-name">
            <div>{{$store.state.usrInfo.name}}</div>
            <span>申请认证</span>
          </div>
          <div class="my-time">
            <div class="my-time-icon">
              <van-icon name="column" />
            </div>
            <div class="my-time-time">
              <div>今日阅读</div>
              <div>5分钟</div>
            </div>
          </div>
        </div>
        <div class="user-fans-data">
          <div>
            <div></div>
            <div>{{$store.state.usrInfo.art_count}}</div>
            <div class="text">动态</div>
          </div>
          <div>
            <div></div>
            <div>{{$store.state.usrInfo.follow_count}}</div>
            <div class="text">关注</div>
          </div>
          <div>
            <div></div>
            <div>{{$store.state.usrInfo.fans_count}}</div>
            <div class="text">粉丝</div>
          </div>
        </div>
      </div>
      <div class="loginIcon" @click='$router.push("/login")' v-else>
        <van-icon name="manager-o" />
      </div>
    </div>
    <div class="operation">
      <div @click='$router.push("/collect")'>
        <van-icon name="star-o" />
        <div>收藏</div>
      </div>
      <div @click='$router.push("/collect")'>
        <van-icon name="clock-o" />
        <div>历史</div>
      </div>
      <div v-if="$store.state.token" @click='$router.push("/works")'>
        <van-icon name="edit" />
        <div>作品</div>
      </div>
    </div>
    <div class="function-list">
      <div class="user-block">
        <van-cell-group>
          <van-cell title="消息通知" is-link to="index" />
          <van-cell title="实名认证" is-link to="index" />
        </van-cell-group>
      </div>
      <div class="user-block">
        <van-cell-group>
          <van-cell title="用户反馈" is-link to="index" />
          <van-cell title="小西同学" is-link to="index" />
          <van-cell title="系统设置" is-link to="index" />
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "account",
  data() {
    return {
    };
  },
  methods: {
    toUsrCenter() {
      this.$router.push("/usrcenter");
    }
  },
  async created() {
    
  }
};
</script>

<style lang='less' scoped>
.my-container {
  background-color: #fff;
  .my-account-data {
    width: 100%;
    height: 175px;
    padding-top: 34px;
    position: relative;
    background-color: #3195f9;
    .loginIcon {
      text-align: center;
      line-height: 70px;
      position: absolute;
      left: 50%;
      top: 50%;
      width: 70px;
      border-radius: 50%;
      font-size: 30px;
      color: #3195f9;
      height: 70px;
      background-color: #fff;
      transform: translate(-50%,-50%);
    }
    .userInfo {
      width: 100%;
      height: 66px;
      display: flex;
      justify-content: center;
      align-items: center;
      .my-avatar {
        border-radius: 50%;
        overflow: hidden;
        width: 66px;
        margin-left: 20px;
        height: 66px;
      }
      .my-name {
        flex: 1;
        height: 66px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        padding-left: 20px;
        div {
          margin-bottom: 10px;
          color: #fff;
          font-size: 16px;
        }
        span {
          border-radius: 9px;
          background-color: #fff;
          font-size: 12px;
          color: #3296fa;
          height: 14px;
          line-height: 12px;
          padding: 2px 7px;
        }
      }
      .my-time {
        width: 110px;
        height: 50px;
        border-radius: 25px 0 0 25px;
        background-color: #3880c8;
        display: flex;
        justify-content: flex-start;
        .my-time-icon {
          width: 35px;
          height: 100%;
          line-height: 54px;
          text-align: center;
          color: #fff;
          font-size: 30px;
          margin-left: 10px;
        }
        .my-time-time {
          font-size: 12px;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
        }
      }
    }
    .user-fans-data {
      width: 100%;
      height: 90px;
      margin-top: 10px;
      display: flex;
      justify-content: flex-start;
      div {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #fff;
        font-size: 24px;
        .text {
          font-size: 16px;
        }
      }
    }
  }
  .operation {
    height: 50px;
    width: 100%;
    padding: 10px 0;
    display: flex;
    div {
      cursor: pointer;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-right: 1px solid #ccc;
      &:last-child {
        border-right: 0;
      }
      .van-icon {
        font-size: 22px;
        &:first-child {
          color: #eb5253;
        }
      }
      div {
        margin-top: 5px;
        font-size: 16px;
      }

      &:nth-child(2) .van-icon {
        color: #ff9d1d;
      }
      &:nth-child(3) .van-icon {
        color: #678eff;
      }
    }
  }
  .function-list {
    background-color: #ccc;
    width: 100%;
    > div {
      background-color: #f5f7f9;
    }
    .user-block {
      padding: 10px 0;
      &:nth-child(2) {
        padding-top: 0;
      }
    }
  }
}
</style>