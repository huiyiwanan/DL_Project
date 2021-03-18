<template>
  <el-container class="home-container">
    <el-header class="oms-header" height="60px">
      <header-top
        ref="headerTops"
        :styleObject="styleObject"
        titleWidth="auto"
        titleBg="#fff"
        titleFontColor="#000"
      ></header-top>
    </el-header>
    <el-container class="home-main">
      <el-aside width="-" class="oms-aside home_oms-left">
        <el-row>
          <el-col :span="24">
            <el-menu
              class="oms-menu"
              :router="true"
              :default-openeds="showArray"
              @open="handleOpen"
              @close="handleClose"
              text-color="#b8b9bc"
              active-text-color="#f23838"
            >
              <template v-for="(item, index) in menus">
                <el-submenu :index="index + ''" :key="item.menuCode" class="oms-sub-menu" v-if="item.sysMenuVOS">
                  <template slot="title">
                    <i
                      class="basic-icon"
                      :class="[{ 'current-title': index == currentIndex }, 'icon-' + item.menuCode]"
                    ></i>
                    <img class="mr5" :src="getIconFun(item.menuCode, index, currentIndex)" alt="" />
                    <span class="oms-sub-menu-title" :class="{ 'current-title': index == currentIndex }">{{
                      item.menuName
                    }}</span>
                  </template>
                  <el-menu-item
                    @click.native="toMenu(index, childrenItemIndex)"
                    class="oms-side-menu"
                    :class="childrenItem.menuPath1 === $route.path ? 'active-menu' : 'non-active-menu'"
                    style="padding-left: 70px"
                    v-for="(childrenItem, childrenItemIndex) in item.sysMenuVOS"
                    :index="childrenItem.menuPath1"
                    :key="childrenItem.menuCode"
                  >
                    <img
                      class="mr5"
                      :src="getIconFun(childrenItem.menuCode, childrenItemIndex, childrenItemCurrentIndex)"
                      alt=""
                    />
                    {{ childrenItem.menuName }}</el-menu-item
                  >
                </el-submenu>
                <el-menu-item
                  v-else
                  @click.native="toMenu(index)"
                  class="oms-sub-menu"
                  :class="item.menuPath1 === $route.path ? 'active-menu' : 'non-active-menu'"
                  :index="item.menuPath1"
                  :key="item.menuCode"
                >
                  <template slot="title">
                    <i
                      class="basic-icon 11"
                      :class="[{ 'current-title': index == currentIndex }, 'icon-' + item.menuCode]"
                    ></i>
                    <img class="mr5" :src="getIconFun(item.menuCode, index, currentIndex)" alt="" />
                    <span :class="{ 'current-title': index == currentIndex }">{{ item.menuName }}</span>
                  </template>
                </el-menu-item>
              </template>
            </el-menu>
          </el-col>
        </el-row>
        <!-- <div class="home_bottom-invite">
          <div class="bold">{{ $t("common.inviteCodeDesTip") }}</div>
          <div class="bold">{{ inviteCode }}</div>
          <div class="title">{{ $t("common.title") }}</div>
          <div class="title">{{ $t("common.titleSec") }}</div>
          <div class="title">{{ $t("common.inviteCodeTip") }}</div>
        </div> -->
      </el-aside>
      <div class="oms-main">
        <router-view></router-view>
      </div>
    </el-container>
  </el-container>
</template>

<script>
import headerTop from 'components/headerTop';
import { mapState, mapMutations } from 'vuex';
import { getMenu } from 'common/js/factory';
import { utils } from 'common/js';
const { sessionCache, CACHE_KEYS } = utils;
export default {
  components: { headerTop },
  computed: {
    ...mapState({
      currentRouter: 'currentRouter',
    }),
  },
  data() {
    return {
      styleObject: {
        background: '#fff',
        color: '#2e2e2c',
        height: '60px',
        'line-height': '60px',
      },
      menus: [],
      showArray: ['0'],
      currentIndex: '0',
      childrenItemCurrentIndex: undefined,
      inviteCode: '',
      // 当前活动菜单
      activeMenuPath: '',
    };
  },

  methods: {
    ...mapMutations(['changeLang']),
    toRouter(val) {
      this.$router.push(val);
    },
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    toMenu(index, childrenItemIndex) {
      this.currentIndex = index + '';
      if (childrenItemIndex !== undefined) {
        this.childrenItemCurrentIndex = childrenItemIndex + '';
      } else {
        this.childrenItemCurrentIndex = undefined;
      }
      sessionCache.set(CACHE_KEYS.SESSION_KEYS.CONSOLE_ACTIVE_ROUTE_INDEX, this.currentIndex);
    },
    getMenus: async function(val, oldVal) {
      var that = this;
      let menu = await getMenu();
      this.menus = menu;
      //   this.removemenuConfiguration(menu);

      // this.menus = await getMenu()

      if (this.menus.length) {
        let index = this.getCurMenuIndex();
        if (!index) {
          index = 0;
        }
        this.currentIndex = index;
        if (this.menus[0].sysMenuVOS) {
          if (this.menus[0].sysMenuVOS > 0) {
            that.toRouter(this.menus[0].sysMenuVOS[index].menuPath1);
          } else {
            that.toRouter(this.menus[index].menuPath1);
          }
        } else {
          that.toRouter(this.menus[index].menuPath1);
        }
      }
    },
    removemenuConfiguration(menu) {
      if (menu.length) {
        if (menu[0].sysMenuVOS) {
          menu[0].sysMenuVOS.forEach((element) => {
            if (element.menuPath1 !== '/menuConfiguration') {
              this.menus.push(element);
            }
          });
        } else {
          menu.forEach((element) => {
            if (element.menuPath1 !== '/menuConfiguration') {
              this.menus.push(element);
            }
          });
        }
      }
    },
    getInviteCode() {
      this.$api.user.getInviteCode((result) => {
        this.inviteCode = result.data.data;
        this.$refs.headerTops.resetInviteCode(result.data.data);
        console.log(result.data.data)
      });
    },
    getCurMenuIndex() {
      let curIndex = sessionCache.get(CACHE_KEYS.SESSION_KEYS.CONSOLE_ACTIVE_ROUTE_INDEX);
      if (!curIndex) {
        return 0;
      }
      return curIndex;
    },
    //获取icon
    getIconFun(item, index, currentIndex) {
      let itemUrl = '';
      switch (item) {
        case '144004005': //数据统计
          itemUrl =
            currentIndex == index
              ? require('../../common/img/menusIcon/icon_data_h.png')
              : require('../../common/img/menusIcon/icon_data_n.png');
          break;
        case '144006001': //账号管理
          itemUrl =
            currentIndex == index
              ? require('../../common/img/menusIcon/icon_account_h.png')
              : require('../../common/img/menusIcon/icon_account_n.png');
          break;
        case '144001001': //客户管理
          itemUrl =
            currentIndex == index
              ? require('../../common/img/menusIcon/icon_customer_h.png')
              : require('../../common/img/menusIcon/icon_customer_n.png');
          break;
        case '144008003': //费用统计
          itemUrl =
            currentIndex == index
              ? require('../../common/img/menusIcon/icon_cost_h.png')
              : require('../../common/img/menusIcon/icon_cost_n.png');
          break;
        case '144005001': //消息推送
          itemUrl =
            currentIndex == index
              ? require('../../common/img/menusIcon/icon_message_h.png')
              : require('../../common/img/menusIcon/icon_message_n.png');
          break;
        case '144005': //通知配置
          itemUrl =
            currentIndex == index
              ? require('../../common/img/menusIcon/icon_message_h.png')
              : require('../../common/img/menusIcon/icon_message_n.png');
          break;
        case '144005002': //升级弹窗
          itemUrl =
            currentIndex == index
              ? require('../../common/img/menusIcon/icon_upgrade_h.png')
              : require('../../common/img/menusIcon/icon_upgrade_n.png');
          break;
        case '144007002': //意见反馈
          itemUrl =
            currentIndex == index
              ? require('../../common/img/menusIcon/icon_feedback_h.png')
              : require('../../common/img/menusIcon/icon_feedback_n.png');
          break;
        case '144007001': //操作日志
          itemUrl =
            currentIndex == index
              ? require('../../common/img/menusIcon/icon_operation_h.png')
              : require('../../common/img/menusIcon/icon_operation_n.png');
          break;
        case '144008002': //设备解绑
          itemUrl =
            currentIndex == index
              ? require('../../common/img/menusIcon/icon_unbind_h.png')
              : require('../../common/img/menusIcon/icon_unbind_n.png');
          break;
      }
      return itemUrl;
    },
  },
  created: function() {},
  mounted() {
    // this.changeLang(window.navigator.language.includes('en-US') ? 'en-US' : 'zh-CN')
    this.getMenus();
    this.getInviteCode();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss">
@import './home.scss';
.home_oms-left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.oms-main {
  background-color: #fcfcfd;
}
.home_bottom-invite {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  margin-bottom: 0.2rem;
  .bold {
    font-size: 0.15rem;
    color: #2e2c2c;
    font-weight: 700;
  }
  .title {
    color: #2e2c2c;
    font-size: 0.1rem;
    margin: 0.01rem 0;
  }
}
</style>
