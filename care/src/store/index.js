import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
// import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const state = {
  userSetInfo: null, // 用户修改信息
  userEntrInfo: null, // 用户的入职时间
  currentUserInfo: '', // 当前用户ID
  responseId: null, // 回复祝福用
  noticeid: null,
  sessionkey: null, // 当前页面sessionkey
}

// const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
})