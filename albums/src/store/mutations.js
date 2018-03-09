import *as types from './mutation-types'
import {setStore, getStore} from 'common/js/store'

const mutations = {
  [types.SAVE_ALBUMSDETAIL](state, albumsDetail) {
    state.detailList = albumsDetail
    setStore('albumsDetail', albumsDetail)
  },
  [types.SAVE_PHOTODETAIL](state, list) {
    state.photoDetailList = list
  },
  [types.SAVE_REPLYID](state, replyid) {
  	state.replyId = replyid
  },
  [types.SAVE_ALBUMSID](state, albumsid) {
  	state.albumsId = albumsid
  },
  [types.SAVE_ALBUMSDETAILID](state, detailid) {
  	state.albumsDetailId = detailid
  },
  [types.CLOSE_REPLYID](state) {
  	state.replyId = null
  },
  [types.CLOSE_ALBUMSID](state) {
  	state.albumsId = null
  },
  [types.CLOSE_ALBUMSDETAILID](state) {
  	state.albumsDetailId = null
  },
  [types.SAVE_PRAISE](state, praise) {
    state.praiseList = praise
  },
  [types.SAVE_SESSIONKEY](state, ssionkey) {
    state.sessionkey = ssionkey
  },
}

export default mutations
