let basePath = window.location.protocol + '//' + window.location.host
let imgBaseUrl = window.location.protocol + '//' + window.location.host + '/'
if (!window.location.origin) {
  basePath = window.location.protocol + '//' + window.location.host + '/oms-back/'
} else {
  basePath = window.location.origin + '/oms-back/'
}


export {
  // 其他接口基本路径
  basePath,
  // 图片接口基本路径
  imgBaseUrl
}