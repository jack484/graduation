import *as types from './mutation-types'
// import {setStore, getStore} from 'common/js/store'

const mutations = {
	[types.SAVE_EXAMDETAIL](state, detail) {
		state.examDetail = detail
		if (detail.length > 0) {
          state.examAnswer = new Array(detail.length)
        }
	},
	// 记录paperid
	[types.REMBER_PAPERID](state, id) {
		state.paperid = id
	},
	// 记录examid
	[types.REMBER_EXAMID](state, id) {
		state.examid = id
	},
	// 记录做题时间
	[types.REMBER_TIME](state, time) {
		state.allTime = time
	},
	// 及格分数
	[types.REMBER_PASSSCORE](state, score) {
		state.passScore = score
	},
	// 总题数
	[types.REMBER_QUESTIONQTY](state, question) {
		state.questionQty = question
	},
  	//点击进入下一题
	[types.ADD_ITEMNUM](state, num) {
		state.itemNum += num
	},
	// //点击进入上一题
	[types.PREV_ITEMNUM](state) {
		state.itemNum--
	},
	[types.SAVE_SESSIONKEY](state, ssionkey) {
	    state.sessionkey = ssionkey
	},
	[types.SAVE_COUNTTIME](state, timer) {
		state.timeNum = timer
	}
}

export default mutations
