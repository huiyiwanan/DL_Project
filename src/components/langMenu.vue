<template>
  <el-dropdown @command="commandHandle" trigger="click">
    <span class="lang-menu">
      <i class="lang-menu-icon" :class="blackMode?'black':'normal'" v-if="!isHideIcon"></i>
      <span class="lang-menu-label" :class="blackMode?'black':'normal'">{{lang}}</span>
      <i class="lang-menu-dropdown" :class="blackMode?'black':'normal'"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="lang in languages" :command="lang" :key="lang.value">{{lang.label}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { getLanguage, i18n } from "@/lang/index";
import { utils } from "../common/js";
import { mapState, mapMutations } from "vuex";

export default {
  props: ["blackMode","isHideIcon"],
  data() {
    return {
      lang: "",
      languages: [
        {
          label: "English",
          value: "en-US",
        },
        {
          label: "简体中文",
          value: "zh-CN",
        },
      ],
    };
  },
  created() {
    this.lang = this.getLangStr();
    //this.isLogin=this.hadLogin();
  },
  computed: {},
  methods: {
    ...mapMutations(["changeLang"]),
    getLangStr() {
      //   let langStr = getLanguage();
      //   console.log("-----langStr--",langStr)
      let Lang = this.languages.find(this.checkAdult);
      //   let Lang = this.$_.find(this.languages, { value: langStr });
      return Lang ? Lang.label : "简体中文";
    },
    checkAdult(Lang) {
      let langStr = getLanguage();
      return Lang.value == langStr;
    },
    commandHandle(lang) {
      // todo 后期重新优化
      let langStr = getLanguage();
      if (langStr !== lang.value) {
        this.changeLang(lang.value);
        this.lang = lang.label;
        // this.$i18n.locale = lang.value;
        const { sessionCache, CACHE_KEYS } = utils;
        // const locales = Object.keys(messages);
        // let seLang = sessionCache.get(CACHE_KEYS.SESSION_KEYS.LANGUAGE) || (navigator.language || navigator.browserLanguage).toLowerCase();
        // for (const locale of locales) {
        // if (seLang.indexOf(locale) > -1) {
        //   console.log("----getLanguage----lang--",seLang,"--locales---",locales)
        //   locale = seLang.value;
        //   }
        // }
        sessionCache.set(CACHE_KEYS.SESSION_KEYS.LANGUAGE, lang.value);
        //todo  切换刷新页面
        location.reload();
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "~@/common/_os_Css/mixins/mixins";
/deep/.el-dropdown {
  color: #fff !important;
}
.lang-menu {
  min-width: 1.1rem;
  // height: 0.3rem;
  // line-height: 0.3rem;
  align-items: center;
  @include flex-row;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }

  &-icon {
    width: 0.2rem;
    height: 0.2rem;
    display: inline-block;
    margin-right: -0.05rem;
    background: url("~@/common/img/common_body_language_white.png") no-repeat;
    background-size: contain;
    &.black {
      background: url("~@/common/img/common_body_top_language_black.png")
        no-repeat;
      background-size: contain;
    }
    &.normal {
      background: url("~@/common/img/common_body_language_white.png") no-repeat;
      background-size: contain;
    }
  }

  &-label {
    min-width: 0.5rem;
    font-size: 0.1rem;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0rem;
    color: #fff;
    margin-left: 0.1rem;
    // margin-right: -0.1rem;
    &.black {
      color: #464f60;
    }
    &.normal {
      color: #fff;
    }
  }

  &-dropdown {
    display: inline-block;
    width: 0;
    height: 0;
    margin: auto 0;
    border-top: 0.06rem solid #fff;
    border-right: 0.05rem solid transparent;
    border-bottom: 0rem solid transparent;
    border-left: 0.05rem solid transparent;
    &.black {
      border-top: 0.06rem solid #464f60;
    }
    &.normal {
      border-top: 0.06rem solid #fff;
    }
  }

  &__console {
    font-size: 0.16rem;
    color: white !important;
  }
}
</style>
