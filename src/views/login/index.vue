<template>
  <div>
    <van-nav-bar class="my-nav-bar" title="标题" />
    <form class="login-wrap">
      <van-cell-group>
        <van-field
          v-model="form.mobile"
          required
          clearable
          label="手机号"
          placeholder="请输入手机号码"
          :error-message="checkmobile"
        />
        <van-field
          v-model="form.code"
          center
          clearable
          label="验证码"
          :error-message="checkCode"
          required
          placeholder="请输入验证码"
        >
          <van-button
            slot="button"
            size="small"
            :disabled="!(sec==60)"
            @click.prevent="sendCode"
            type="primary"
          >{{showCodeTip}}</van-button>
        </van-field>
      </van-cell-group>
      <div class="login-btn">
        <van-button type="info" @click.prevent="doLogin">登录</van-button>
      </div>
    </form>
  </div>
</template>

<script>
import { login } from "../../utils/http/";
export default {
  name: "login",
  data() {
    return {
      form: {
        mobile: "13911111111",
        code: "56560"
      },
      sec: 60,
      errorMsg: {
        mobileError: "请输入11位的手机号码",
        codeError: "请输入6位数字"
      }
    };
  },
  computed: {
    //手机号码数据是否合法
    checkmobile() {
      return /^0?(13|14|15|18|17)[0-9]{9}$/.test(this.form.mobile)
        ? ""
        : this.errorMsg.mobileError;
    },
    //验证码是否合法
    checkCode() {
      return /^\d{6}$/.test(this.form.code) ? "" : this.errorMsg.codeError;
    },
    showCodeTip() {
      let showWord = this.sec == 60 ? "发送验证码" : `${this.sec}秒重新发送`;
      return showWord;
    }
  },
  methods: {
    async doLogin() {
      //如果表单数据不合法 直接返回
      if (this.checkmobile == "" && this.checkCode == "") {
        //合法则发送请求
        let res = await login(this.form);
        console.log(res);
        //把登陆成功获取到的token存到sessionStorage中
        window.sessionStorage.setItem("token", JSON.stringify(res.data.data.token));
        this.$store.commit('setToken',res.data.data.token)
        this.$router.push('/home');
      } else {
        return;
      }
    },
    sendCode() {
      //模拟发送验证码
      this.sec--;
      let timerId;
      timerId = setInterval(() => {
        if (this.sec > 0) {
          this.sec--;
          if (this.sec == 58) {
            this.form.code = "246810";
          }
        } else {
          this.sec = 60;
          clearInterval(timerId);
        }
      }, 1000);
    }
  }
};
</script>

<style lang='less' scoped>
.login-wrap {
  padding: 0 20px;
  .login-btn {
    width: 100%;
    margin-top: 20px;
    .van-button {
      width: 100%;
    }
  }
}
</style>