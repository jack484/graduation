import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const state = {
  praiseList: [], // 点赞
  collectFlag: '', // 收藏状态
  responseId: null, // 评论他人时要传的ID
  newsId: null,
  sessionkey: null, // 当前页面sessionkey
  wishList: [], // 收到的推送祝福消息列表
  userInfo: '', // 个人信息
  wishResponseId: '', // 获取回复他人时，他的Id
  noticeid: null,
  festivalId: null,
}

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})