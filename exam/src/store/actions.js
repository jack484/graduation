import *as types from './mutation-types'

// sessionkey
export const saveSessionKey = function ({commit}, ssionkey) {
  commit(types.SAVE_SESSIONKEY, ssionkey)
}

// 记录paperid
export const savePaperId = function ({commit}, id) {
  commit(types.REMBER_PAPERID, id)
}

// 记录examid
export const saveExamId = function ({commit}, id) {
  commit(types.REMBER_EXAMID, id)
}

// 记录总共用时
export const saveAllTime = function ({commit}, time) {
  commit(types.REMBER_TIME, time)
}

// 记录及格分
export const savePassScore = function ({commit}, score) {
  commit(types.REMBER_PASSSCORE, score)
}

// 记录总题数
export const saveQuestionQty = function ({commit}, QuestionLen) {
  commit(types.REMBER_QUESTIONQTY, QuestionLen)
}

// 记录倒计时的状态
export const saveCountTime = function ({commit}, time) {
  commit(types.SAVE_COUNTTIME, time)
}
