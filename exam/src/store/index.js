import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const state = {
  examDetail: null,
  examAnswer: [], // 用户答案
  itemNum: 1, // 第几题
  examid: null,
  paperid: null,
  allTime: null, // 总共用时
  passScore: null, // 及格分数
  questionQty: null, // 总题数
  sessionkey: null, // 当前页面sessionkey
  timeNum: null,
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