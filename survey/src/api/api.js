// 定义url
// export const url = () => 'http://wx.u-together.cn/quany/route/service?sessionKey='

export const url = () => 'https://weixin.quanyou.com.cn:8100/quany/route/service?sessionKey='

// 获取sessionkey

export function getUrlKey(s) {
  let key = sessionStorage.getItem(s)
  if (key === null) {
    let urlKey = decodeURIComponent((new RegExp('[?|&]'+s+'=([^&;]+?)(&|#|;|$)').exec(location.href) || [''])[1].replace(/\+/g, '%20')) || null
    sessionStorage.setItem(s, urlKey)
    return urlKey
  } else {
    return key
  }
}

export function getUrlId(id) {
  let detailId = sessionStorage.getItem(id)
  if (detailId === null) {
    let urlId = decodeURIComponent((new RegExp('[?|&]'+id+'=([^&;]+?)(&|#|;|$)').exec(location.href) || [''])[1].replace(/\+/g, '%20')) || null
    sessionStorage.setItem(id, urlId)
    return urlId
  } else {
    return detailId
  }
}

export function getUrlParam(paramName) {
  let reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)")
  let r = window.location.search.substr(1).match(reg)
  // if(r != null) return unescape(r[2])
  // return null
}
