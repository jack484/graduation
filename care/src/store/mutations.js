import *as types from './mutation-types'
import {setStore, getStore} from 'common/js/store'

const mutations = {
  [types.SAVE_USERINFO](state, info) {
    state.userSetInfo = info
    setStore('info', info)
  },
  [types.SAVE_USERENTRINFO](state, entrInfo) {
  	state.userEntrInfo = entrInfo
  },
  [types.SAVE_CURRENTUSERINFO](state, userInfo) {
  	state.currentUserInfo = userInfo
  },
  [types.SAVE_RESPONSEID](state, id) {
    state.responseId = id
  },
  [types.DEL_RESPONSEID](state) {
    state.responseId = null
  },
  [types.SAVE_NOTICEID](state, noticeid) {
    state.noticeid = noticeid
  },
  [types.DEL_NOTICEID](state, noticeid) {
    state.noticeid = null
  },
  [types.SAVE_SESSIONKEY](state, ssionkey) {
    state.sessionkey = ssionkey
  },
}

export default mutations
