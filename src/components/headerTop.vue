<template>
  <el-row class="header-top" :style="styleObject">
    <h3
      class="header-top-title text-left bg-purple"
      :style="{
        width: titleWidth ? titleWidth : 'auto',
        background: titleBg,
        color: titleFontColor,
        'font-weight': '500',
      }"
    >
      <span class="log-icon" :class="{ 'log-iconB': logoIconB }"></span>
      <span class="header-title">{{ $t('common.cos') }}</span>
    </h3>

    <ul class="header-top-right pull-right">
      <li
        class="pull-left display-f inviteCodeLi"
        @mousemove="inviteCodeTitle = true"
        @mouseout="inviteCodeTitle = false"
        v-if="token && this.$store.state.userType == 4"
      >
        <span :class="['mr10px cp fs12px', inviteCodeTitle ? 'col-295BFF' : '']">
          {{ $t('common.inviteCodeDesTip') }}
        </span>
        <span :class="['bold fs24px mr20 cp', inviteCodeTitle ? 'col-295BFF' : '']">{{ inviteCode }}</span>
        <div class="inviteCodeTitle" v-show="inviteCodeTitle">
          {{ $t('common.title') }}
          <br />
          {{ $t('common.titleSec') }}
          <br />
          {{ $t('common.inviteCodeTip') }}
          <!-- <p class="tips">{{ $t("common.title") }}</p>
          <p class="tips">{{ $t("common.titleSec") }}</p>
          <p class="tips">{{ $t("common.inviteCodeTip") }}</p> -->
        </div>
      </li>
      <lang-menu class="lang-menu pull-left" :blackMode="true"></lang-menu>
      <!--更多-->
      <el-dropdown
        class="user-msg header-top-li pull-left"
        trigger="click"
        @command="onItemClick"
        v-if="hasLogin && currentRouter !== '/login'"
      >
        <span class="more">
          <span class="user-text">{{ this.$t('customDesign.more') }}</span>
          <span class="down-triangle"></span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in dropdownMenu" :key="item.command" :command="item.command">
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <li class="header-top-li pull-left" v-if="hasLogin && currentRouter !== '/login'">
        <span @click="logout">{{ $t('common.logout') }}</span>
      </li>
      <li class="header-top-li pull-left last-li" v-if="!hasLogin && currentRouter !== '/login'">
        <span @click="toRouter('/login')">{{ $t('common.login') }}</span>
      </li>
    </ul>
    <!-- <el-col :span="12" class="header-top-el-col" :style="{ flex: titleWidth ? titleWidth + ' 0 0' : '1', width: titleWidth? titleWidth +'px': '200px',background: titleBg, color: titleFontColor }">
            <div class="text-left bg-purple flex header-top-title">
                <span class="log-icon" :class="{'log-iconB': logoIconB}" @click="toRouter('/')"></span>
                <span class="header-title" @click="toRouter('/')">零售云运营系统</span>
            </div>
        </el-col>
        <el-col :span="12" class="header-top-el-col">
            <div class="text-left bg-purple-light">
                <ul class="header-top-right pull-right">
                    <li class="header-top-li pull-left" v-if="hasLogin && currentRouter !== '/login'">
                        <span @click="logout">{{$t('common.logout')}}</span>
                    </li>
                    <li class="header-top-li pull-left last-li" v-if="!hasLogin && currentRouter !== '/login'">
                        <span @click="toRouter('/login')">{{$t('common.login')}}</span>
                    </li>
                </ul>
            </div>
    </el-col>-->
  </el-row>
</template>
<script>
import { mapState } from 'vuex';
import langMenu from '@/components/langMenu';
export default {
  components: {
    langMenu,
  },
  props: {
    styleObject: Object,
    logoIconB: Boolean,
    titleWidth: {
      type: String,
      default: '',
    },
    titleBg: {
      type: String,
      default: '',
    },
    titleFontColor: {
      type: String,
      default: '#fff',
    },
  },
  computed: mapState(['hasLogin', 'currentRouter']),
  mounted() {
    // this.inviteCode = this.homeInviteCode || '';
  },
  data() {
    return {
      dropdownMenu: [
        {
          // 邀请码
          command: 'inviteCode',
          label: this.$t('common.inviteCodeDropTip'),
        },
        {
          // 修改密码
          command: 'changePsw',
          label: this.$t('changePsw.changePsw'),
        },
      ],
      inviteCode: '',
      inviteCodeTitle: false,
      token: sessionStorage.getItem('token') || '',
    };
  },
  methods: {
    resetInviteCode(val){
      this.inviteCode = val;
      console.log(val)
    },
    /**
     * @method toRouter() 跳转相应路由
     * @param val 相应的路由配置中的值
     */
    toRouter(val) {
      this.$router.push(val);
    },
    logout() {
      var that = this;
      this.resetAjax({
        url: '/oms/auths/sysUsers/logOut',
        method: 'get',
        isSNoTip: true,
        onSuccess() {
          that.toRouter('/login');
        },
      });
    },
    onItemClick(command) {
      if (command == 'inviteCode') {
        this.$router.push('/inviteCode');
      } else if (command == 'changePsw') {
        this.$router.push('/changePwd');
      }
    },
  },
  watch:{
  }
};
</script>
<style lang="scss">
@import '~common/css/constant.scss';
.user-msg {
  .down-triangle {
    display: inline-block;
    width: 0rem;
    height: 0rem;
    border-top: 0.06rem solid #464f60;
    border-right: 0.05rem solid transparent;
    border-bottom: 0rem solid transparent;
    border-left: 0.05rem solid transparent;
  }
}

.header-top-title {
  align-items: center;
  height: 60px;
  margin: 0;
  float: left;
}

.bg-purple-light {
  background: #000;
}

.log-icon {
  width: 35px;
  height: 35px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 20px;
  background: url('~common/img/retailcloud.png') no-repeat;
  // cursor: pointer;
  background-size: contain;
}

.log-iconB {
  background: url('~common/img/retailcloud.png') no-repeat;
  background-size: contain;
}

.header-top {
  height: 42px;
  line-height: 40px;
  width: 100%;
  // display: flex;
  &::before {
    content: '';
    width: 100%;
    position: absolute;
    height: 1px;
    opacity: 0.25;
    background: #a7a7a7;
    bottom: 0;
  }

  .down-triangle {
    display: inline-block;
    width: 0rem;
    height: 0rem;
    border-top: 0.06rem solid #464f60;
    border-right: 0.05rem solid transparent;
    border-bottom: 0rem solid transparent;
    border-left: 0.05rem solid transparent;
  }
}

.header-top-el-col {
  flex: 1;
}

.header-title {
  font-size: 18px;
  margin-left: 5px;
  // cursor: pointer;
  display: inline-block;
  vertical-align: middle;
}

.header-top-right .header-top-li {
  text-align: left;
  cursor: pointer;
}

.header-top-li > span {
  padding: 0 20px;
}

.header-top-li span:hover {
  color: $focusColor;
}

.header-top-right .last-li {
  width: 66px;
}

.bold {
  font-weight: bold;
}

.cp {
  cursor: pointer;
}

.inviteCodeLi {
  position: relative;
  .inviteCodeTitle {
    position: absolute;
    top: 50px;
    padding: 20px 25px;
    width: 350px;
    line-height: 18px;
    font-size: 14px;
    color: #646c7f;
    left: -72px;
    border: 1px solid #d2d3d5;
    background: #fff;
    .tips {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 18px;
      font-size: 14px;
      color: #646c7f;
    }
  }
}
</style>
