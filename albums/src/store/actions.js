import *as types from './mutation-types'

// sessionkey
export const saveSessionKey = function ({commit}, ssionkey) {
  commit(types.SAVE_SESSIONKEY, ssionkey)
}

// 子相册列表详情
export const saveAlbumsDetailList = function ({commit}, list) {
  commit(types.SAVE_ALBUMSDETAIL, list)
}

// 相册详情
export const savePhotoList = function ({commit}, photoList) {
  commit(types.SAVE_PHOTODETAIL, photoList)
}

// albumsReplyId
export const saveAlbumsReplyId = function ({commit}, replyid) {
  commit(types.SAVE_REPLYID, replyid)
}

// albumsId
export const saveAlbumsId = function ({commit}, id) {
  commit(types.SAVE_ALBUMSID, id)
}

// albumsDetailId
export const saveAlbumsDetailId = function ({commit}, detailId) {
  commit(types.SAVE_ALBUMSDETAILID, detailId)
}

// 点赞状态
export const savePraise = function ({commit}, praise) {
  commit(types.SAVE_PRAISE, praise)
}
