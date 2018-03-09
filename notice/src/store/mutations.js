import *as types from './mutation-types'
// import {setStore, getStore} from 'common/js/store'

const mutations = {
  [types.SAVE_SESSIONKEY](state, ssionkey) {
    state.sessionkey = ssionkey
  },
  [types.SAVE_PRAISE](state, praise) {
  	state.praiseList = praise
  },
  [types.SAVE_COLLECTFLAG](state, collect) {
  	state.collectFlag = collect
  },
  [types.SAVE_NEWSRESPONSEID](state, newsReplyId) {
    state.responseId = newsReplyId
  },
  [types.CLOSE_RESPONSEID](state) {
    state.responseId = null
  },
  [types.SAVE_NEWSID](state, id) {
    state.newsId = id
  },
  [types.CLOSE_NEWSID](state) {
    state.newsId = null
  },
  [types.SAVE_WISHLIST](state, list) {
    state.wishList = list
  },
  [types.SAVE_USERINFO](state, info) {
    state.userInfo = info
  },
  [types.SAVE_RESPONSEID](state, resId) {
    state.wishResponseId = resId
  },
  [types.SAVE_NOTICEID](state, noticeid) {
    state.noticeid = noticeid
  },
  [types.SAVE_FESTIVALID](state, festivalId) {
    state.festivalId = festivalId
  },
  [types.DEL_NOTICEID](state, noticeid) {
    state.noticeid = null
  },
  [types.DEL_RESPONSEID](state) {
    state.responseId = null
  },
}

export default mutations
