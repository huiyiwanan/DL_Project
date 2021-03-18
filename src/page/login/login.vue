<template>
  <div class="login-bg relative">
    <div class="login-box relative" :class="userSelectClass">
      <el-form
        class="login-form relative"
        :model="formData"
        status-icon
        :rules="formRule"
        ref="formData"
        :show-message="false"
      >
        <img class="login-form-icon width58px height58px" src="@/common/img/retailcloud.png" alt="" />
        <p class="text-center login-text">COS Pro OMS</p>
        <p class="error-tip"><span class="el-icon-error" v-if="!!errorTip"></span>{{ errorTip }}</p>
        <el-form-item prop="userName">
          <el-input v-model.trim="formData.userName" :placeholder="$t('login.pleaseInputPhoneAndEmail')"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            type="password"
            v-model.trim="formData.pass"
            @keyup.enter.native="submitForm('formData')"
            :placeholder="$t('login.pleaseInputPassword')"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isShowSlider">
          <slider-bar
            class="portal-login-slider"
            ref="silderBar"
            @success="sliderSucHandle"
            :successText="$t('common.validateSuc')"
            :startText="$t('common.validateBegin')"
          ></slider-bar>
        </el-form-item>
        <el-form-item class="login-submit-box">
          <el-button class="login-btn" type="danger" @click="submitForm('formData')">{{
            $t('common.login')
          }}</el-button>
        </el-form-item>
        <div class="langMenu">
          <lang-menu class="lang-menu pull-left" :blackMode="true" :isHideIcon="true"></lang-menu>
        </div>
      </el-form>
    </div>
    <footerBar></footerBar>
  </div>
</template>
<script>
import langMenu from '@/components/langMenu';
import footerBar from 'components/footer';
import validator from 'common/js/validator';
import { login } from './loginFactory';
import { mapState } from 'vuex';
import sliderBar from './SliderBar';
import { utils } from '../../common/js';
const { sessionCache, CACHE_KEYS } = utils;
export default {
  components: { footerBar, sliderBar, langMenu },
  data() {
    let userCont = 0;
    let passCont = 0;
    let checkFormData = () => {
      if (!this.formData.userName && userCont !== 0) {
        this.errorTip = this.$t('login.pleaseInputPhoneAndEmail');
      } else if (!this.formData.pass && passCont !== 0) {
        this.errorTip = this.$t('login.pleaseInputPassword');
      } else {
        this.errorTip = '';
      }
    };
    let hasUser = (rule, value, callback) => {
      userCont = 1;
      if (value !== '') {
        callback();
      } else {
        callback(new Error(this.$t('login.pleaseInputPhoneAndEmail')));
      }
      checkFormData();
    };
    let hasPass = (rule, value, callback) => {
      passCont = 1;
      if (value !== '') {
        callback();
      } else {
        callback(new Error(this.$t('login.pleaseInputPassword')));
      }
      checkFormData();
    };
    return {
      //设置头部的样式
      styleObject: {
        background: '#fff',
        color: '#2e2e2c',
        height: '60px',
        'line-height': '60px',
      },
      isShowSlider: false,
      failCtn: 0,
      userSelectClass: '',
      sliderSuccess: false,
      errorTip: '',
      formData: {
        userName: sessionCache.get(CACHE_KEYS.SESSION_KEYS.USERNAME) || '',
        pass: '',
      },
      formRule: {
        userName: [{ validator: hasUser }],
        pass: [{ validator: hasPass }],
      },
    };
  },
  computed: {
    pswInputType() {
      return this.formData.pass ? 'password' : 'text';
    },
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.isShowSlider && !this.silderValidate) {
            this.$message(this.$t('common.validateBeginTip'));
            return;
          }
          // 大于3则不再增加
          if (this.failCtn < 3) {
            this.failCtn = this.failCtn + 1;
          }
          if (this.$refs.silderBar) {
            this.$refs.silderBar.reset();
            this.silderValidate = false;
          }
          let loginData = await login(this.formData.userName, this.formData.pass);

          this.$store.commit('changeLogin', {
            userName: this.formData.userName,
            jwt: loginData.jwt,
            userType: loginData.sysUser.userType,
            hasLogin: true,
            userAreas: loginData.sysUser.userAreas,
            areaList: loginData.sysUser.areaList,
          });

          this.$store.commit('setToken', {
            userName: this.formData.userName,
            access_token: loginData.jwt,
            hasLogin: true,
          });
          this.toRoute('/');
        }
      });
    },
    sliderSucHandle() {
      this.silderValidate = true;
    },
    /**
     * toRoute() 跳转到相应的路由页面
     *
     */
    toRoute(val) {
      this.$router.push(val);
    },
  },
  watch: {
    failCtn(val) {
      // 如果失败次数大于3次
      if (val >= 3 && !this.isShowSlider) {
        this.isShowSlider = true;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import './login.scss';

/deep/ .el-input__inner {
  height: 44px;
}
</style>
