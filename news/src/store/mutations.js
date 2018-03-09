import *as types from './mutation-types'

const mutations = {
  [types.SAVE_SESSIONKEY](state, ssionkey) {
    state.sessionkey = ssionkey
  },
  [types.SAVE_NEWSLIST](state, list) {
    state.newsList = list
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
  }
}

export default mutations
