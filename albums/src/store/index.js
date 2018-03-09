import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const state = {
  detailList: [], // 子相册列表详情
  photoDetailList: [], // 相册详情
  replyId: null,
  albumsId: null,
  albumsDetailId: null,
  praiseList: null,
  sessionkey: null, // 获取当前页面sessionkey
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