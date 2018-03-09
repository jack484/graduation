import *as types from './mutation-types'

// sessionkey
export const saveSessionKey = function ({commit}, ssionkey) {
  commit(types.SAVE_SESSIONKEY, ssionkey)
}

// 新闻列表详情
export const saveNewsList = function ({commit}, list) {
  commit(types.SAVE_NEWSLIST, list)
}

// 点赞状态
export const savePraise = function ({commit}, praise) {
  commit(types.SAVE_PRAISE, praise)
}

// 收藏状态
export const saveCollectFlag = function ({commit}, collect) {
  commit(types.SAVE_COLLECTFLAG, collect)
}

// 评论他人时要传的ID
export const saveNewsResponseId = function ({commit}, newsReplyId) {
  commit(types.SAVE_NEWSRESPONSEID, newsReplyId)
}

export const saveNewsId = function ({commit}, id) {
  commit(types.SAVE_NEWSID, id)
}
