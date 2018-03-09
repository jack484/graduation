import *as types from './mutation-types'

// sessionkey
export const saveSessionKey = function ({commit}, ssionkey) {
  commit(types.SAVE_SESSIONKEY, ssionkey)
}

// 用户生日信息
export const saveUserSetInfo = function ({commit}, list) {
  commit(types.SAVE_USERINFO, list)
}

// 用户入职信息
export const saveUserEntrInfo = function ({commit}, i) {
  commit(types.SAVE_USERENTRINFO, i)
}

// 用户入职信息
export const saveCurrentUserInfo = function ({commit}, info) {
  commit(types.SAVE_CURRENTUSERINFO, info)
}

// responseId
export const saveResponseId = function ({commit}, id) {
  commit(types.SAVE_RESPONSEID, id)
}

// noticeid
export const saveNoticeId = function ({commit}, noticeid) {
  commit(types.SAVE_NOTICEID, noticeid)
}
