<template>
  <div class="container">
    <van-nav-bar
      class="my-nav-bar"
      title="个人信息"
      @click-left="$router.back()"
      left-arrow
      right-text="保存"
      @click-right="editUserinfo"
    ></van-nav-bar>
    <div class="block top-block">
      <van-cell-group>
        <van-uploader name="photo" :after-read="afterRead">
          <van-cell title="头像" is-link>
            <template>
              <form ref="form">
                <van-image fit="fill" round width="30px" height="30px" :src="getstore.photo" />
              </form>
            </template>
          </van-cell>
        </van-uploader>
        <van-cell title="昵称" @click="type='nickName';editInfo=true" :value="tempniname" is-link />
        <van-cell
          @click="type='introduce';editInfo=true"
          title="介绍"
          class="birthday"
          :value="tempintroduce"
          is-link
        />
      </van-cell-group>
    </div>
    <div class="block top-block">
      <van-cell-group>
        <van-cell title="性别" @click="type='gender';editInfo=true" :value="gender" is-link />
        <van-cell title="生日" @click="type='birthday';editInfo=true" class="birthday" is-link>
          <template>
            <span>{{tempBirthday}}</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <van-popup v-model="editInfo" position="bottom" :style="{ height: '40%' }">
      <van-cell-group>
        <van-field v-if="type=='nickName'" v-model="tempniname" placeholder="请输入用户名" />
        <van-field v-if="type=='introduce'" v-model="tempintroduce" placeholder="请输入介绍" />
        <van-picker
          v-if="type=='gender'"
          :default-index="getstore.gender"
          :columns="columns"
          @change="genderChange"
        />
        <van-datetime-picker
          v-if="type=='birthday'"
          v-model="currentDate"
          type="date"
          @change="dateChange"
        />
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
import vueclip from "vue-clip";
import { editAvatar, editUserInfo } from "@/api/author.js";
import { getUserInfo, setUserDetail } from "@/utils/storage/";
import dayjs from "dayjs";
export default {
  name: "usrcenter",
  components: {
    vueclip
  },
  data() {
    return {
      editInfo: false,
      type: "",
      currentDate: "",
      tempBirthday: "",
      tempniname: "",
      tempintroduce: "",
      tempgenders: "",
      options: {
        url: "/upload",
        paramName: "file"
      },
      columns: ["男", "女"]
    };
  },
  computed: {
    getstore() {
      return this.$store.state.usrInfo;
    },
    gender() {
      return this.tempgenders ? "女" : "男";
    }
  },
  methods: {
    async editUserinfo() {
      let params = {
        name: this.tempniname,
        gender: this.tempgenders,
        birthday: dayjs(this.currentDate).format("YYYY-MM-DD"),
        intro: this.tempintroduce
      };
      let edit = await editUserInfo(params);
      console.log(edit);
      
      if (edit.status == 201) {
        this.$toast("资料修改成功");
        // this.$store.commit("setInfo", params);
        setUserDetail(params);
      }
    },
    dateChange() {
      let birthday = dayjs(this.currentDate).format("YYYY-MM-DD");
      this.tempBirthday = birthday;
    },
    genderChange(a, value, index) {
      console.log(index);
      
      this.tempgenders = index;
    },
    afterRead(files) {
      let fd = new FormData(this.$refs["form"]);
      fd.append("photo", files.file);

      ImagePreview({
        images: [files.content],
        onClose: () => {
          this.$dialog
            .confirm({
              title: "提示",
              message: "是否把当前图片设置为头像?"
            })
            .then(async () => {
              let editIcon = await editAvatar(fd);
              this.$store.commit("setUsrAvatar", files.content);
            })
            .catch(() => {
              this.$toast("用户取消上传");
            });
        }
      });
    }
  },
  created() {
    this.tempgenders = getUserInfo().gender;
    this.tempniname = getUserInfo().name;
    this.tempintroduce =  getUserInfo().intro;
    this.tempBirthday = getUserInfo().birthday;
    this.currentDate = new Date(getUserInfo().birthday);
  }
};
</script>

<style lang='less' scoped>
.container {
  > div.block {
    background-color: #f5f7f9;
  }
  .top-block {
    padding-bottom: 10px;
    &:nth-child(3) {
      padding: 0;
    }
  }
}
.birthday {
  .van-cell__value {
    span {
      color: "#1989fa";
    }
  }
}
/deep/.van-uploader {
  width: 100%;
  .van-uploader__input-wrapper {
    width: 100%;
  }
}
.clip {
  height: 50px;
}
</style>