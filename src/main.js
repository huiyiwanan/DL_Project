import Vue from 'vue';
import ElementUI from 'element-ui';
// import enLocale from 'element-ui/lib/locale/lang/en'
// import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
// import 'common/lib/jquery.jcryption.3.1.0.js';
import 'element-ui/lib/theme-chalk/index.css';

import 'babel-polyfill';
import 'lodash';
// import './common/js/util';
// import './common/js/common';
// import './common/js/directive';
import './config/appVars';
// import './common/css/base/index.scss';

import App from './App';
import router from './router';
// import store from './store/index';
// 注册插件
// import pulgins from './plugins';
// import i18n from './lang';
//自己维护的中文
// import enSelf from './lang/en';
//自己维护的英文
// import cnSelf from './lang/zh-cn';

//对ajax的统一封装，具体见ajaxReset.js
// import resetAjax from 'common/js/ajaxReset';

// ztree
// import './common/lib/ztree/css/zTreeStyle.scss';
// import './common/lib/ztree/js/jquery.ztree.core.js';
// import './common/lib/ztree/js/jquery.ztree.excheck.js';
// import './common/lib/ztree/js/jquery.ztree.exedit.js';
// import './common/lib/ztree/js/jquery.ztree.exhide.js';
// md5
// import md5 from './common/lib/md5';

// import { utils } from 'common/js';

import echarts from 'echarts';

Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) });
Vue.use(pulgins);

Vue.config.productionTip = false;

const { sessionCache, CACHE_KEYS } = utils;
let lang = 'zh-CN';
lang = sessionCache.get(CACHE_KEYS.SESSION_KEYS.LANGUAGE);
if (lang.includes('en')) {
  Vue.config.lang = 'en-US';
  document.title = 'COS Pro OMS';
} else {
  Vue.config.lang = 'zh-CN';
  document.title = 'COS Pro OMS';
}

// if ((window.navigator.browserLanguage || window.navigator.language).includes('en')) {
//     Vue.config.lang = 'en-US'
// } else {
//     Vue.config.lang = 'zh-CN'
// }
//所有英文
// const allEn = Object.assign(enLocale, enSelf)
// //所有中文
// const allCn = Object.assign(zhLocale, cnSelf)

// Vue.locale('en', allEn)
// Vue.locale('zh-cn', allCn)

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && to.path !== '/401' && to.path !== '/404') {
    var dataMsg = sessionStorage.getItem('dataMsg');
    if (!dataMsg || dataMsg.toString() == '{}') {
      next({ path: '/login' });
    } else {
      // store.commit('changeLogin', JSON.parse(sessionStorage.getItem('dataMsg')));
      next();
    }
  } else {
    // store.commit('changeLogin');
    next();
  }
});

Vue.prototype.token = sessionStorage.token;
Vue.prototype.resetAjax = resetAjax;
Vue.prototype.$echarts = echarts;
// Vue.prototype.md5 = md5;
var case1 = new Vue({
  el: '#app',
  router,
  i18n,
  // store,
  template: '<App/>',
  components: {
    App,
  },
});

// 把实例对象挂在到全局
window.vm = case1;

Vue.prototype.$t = case1['$children'][0].$t;

export default case1;
