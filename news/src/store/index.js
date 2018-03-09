import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const state = {
  newsList: [], // 新闻详情列表
  praiseList: [], // 点赞
  collectFlag: '', // 收藏状态
  responseId: null, // 评论他人时要传的ID
  newsId: null,
  sessionkey: null, // 当前页面sessionkey
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