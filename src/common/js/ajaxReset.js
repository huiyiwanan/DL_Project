import Vue from 'vue'
import axios from 'axios'
import store from 'store/index'
import utils from './utils'
import router from 'router/index.js'
import { basePath } from 'config/env'
import { getLanguage } from "@/lang/index";
let vue = new Vue({ store })

function _getApp() {
  let App;
  if (window.vm) {
    App = window.vm;
  } else {
    App = {};
  }
  return App;
}

const instance = axios.create({
  timeout: 10000
})
/**
 * @method resetAjax ()ajax方法的封装
 * @param param.method 请求的方法
 * @param param.url 请求的地址
 * @param param.headers 请求头
 * @param param.data 请求的数据
 * @param param.onSuccess 成功时需要的回调
 * @param param.onError 错误时需要的回调
 * @param param.sTipStr 成功时的提示
 * @param param.eTipStr 错误时的提示
 * @param param.isSNoTip   true说明成功的不需要弹提示，默认为false
 * @param param.isENoTip   true说明不需要错误的提示信息，默认为false
 * @param param.isNoLock true代表不需要锁屏
 */
function ajaxReset(param) {
  let App = _getApp();
  let loadingInstance = ''
  if (!param.isNoLock) { //客户端不创建锁屏
    loadingInstance = vue.$loading({ fullscreen: true, background: 'rgba(0, 0, 0, 0.7)', spinner: 'el-icon-loading', text: 'Loading...' })
  }
  let path = basePath + param.url
  let headers = {
    'app_id': vue.$store.state.userName,
    'Authorization': vue.$store.state.jwt,
    'locale': getLanguage(),
  }
  param.twoAuthorization ? headers.twoAuthorization = param.twoAuthorization : ''
  instance({
    method: param.method,
    url: path,
    data: param.data || {},
    params: param.data && param.data.params ? param.data.params : {},
    headers: param.headers || headers
  }).then(function (res) {
    res = utils.decodeObj(res)
    if (res.data.success) {
      //加定时器防止闪屏
      !!loadingInstance && loadingInstance.close()
      param.onSuccess && param.onSuccess(res)
      if (param.isSNoTip) {
        return
      }
      // let msg = param.sTipStr ? param.sTipStr : App.$t('selfLang.operaterSuccess')
      // vue.$message.success(msg)
    } else {
      !!loadingInstance && loadingInstance.close()

      // 登录超时或请求超时重新获取token，并再次请求接口
      if (res && res.data && res.data.status === 1005) {
        vue.$store.commit('changeLogin', {
          jwt: res.data.message,
          hasLogin: true
        })
        console.log(vue.$store.state.jwt)
        setTimeout(function () {
          ajaxReset(param)
        }, 1000)
        return
      }
      // 登录超时或请求超时跳转至超时页面
      if (res && res.data && res.data.code && res.data.code === '011003') {
        // 如果是登出接口，直接返回
        if (path.includes('/auths/sysUsers/logOut')) {
          router.push('/login')
          return
        }
        router.push('/401')
        return
      }
      // 登录超时或请求超时跳转至超时页面
      if (res && res.data && res.data.code && res.data.code === '015003') {
        // 如果是登出接口，直接返回
        if (path.includes('/auths/sysUsers/logOut')) {
          router.push('/login')
          return
        }
        router.push('/401')
        return
      }
      param.onError && param.onError(res)
      if (param.isENoTip) {
        return
      }
      let defaultErrMsg = param.eTipStr ? param.eTipStr : App.$t('selfLang.ajaxDisconnect')
      let errMsg = res.data.errMsg ? res.data.errMsg : defaultErrMsg
      let msg = param.eTipStr ? param.eTipStr : errMsg
      vue.$message.error(msg)
    }
  }).catch(function (e) {
    console.log(e);
    !!loadingInstance && loadingInstance.close()
    param.onError && param.onError(e)

    let msg = param.eTipStr ? param.eTipStr : App.$t('selfLang.ajaxDisconnect')

    // 登录超时或请求超时跳转至超时页面
    if (e.response && (e.response.status === 401)) {
      // 如果是登出接口，直接返回
      if (path.includes('/auths/sysUsers/logOut')) {
        router.push('/login')
        return
      }
      router.push('/401')
      return
    } else if (e.response && (e.response.status === 504)) {
      router.push('/login')
      return

    } else if (!navigator.onLine) {
      msg = App.$t('common.networkErr')
      vue.$message.error(msg)
      return
    }
    if (param.isENoTip) {
      return
    }
    vue.$message.error(msg)
  })
}
export default ajaxReset