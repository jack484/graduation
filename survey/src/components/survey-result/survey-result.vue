<template>
  <transition name="slider">
    <div class="survey-detail">
      <scroll class="list-survey" :data="object" :mouseWheel="mouseWheel">
        <div class="survey-detail-wrapper">
          <div class="survey-detail-header" v-if="itemDetail.questionnaire">
            <div class="survey-head-width">
              <p class="paddingTop">
                <span class="header-title">{{itemDetail.questionnaire.name}}</span>
              </p>
              <p class="flex paddingTop">
                <span class="flex-item">截止时间:&nbsp;{{itemDetail.questionnaire.validTo | dateTime}}</span>
                <span class="flex-item text-right">参与人数:&nbsp;{{itemDetail.questionnaire.replyQty}}</span>
              </p>
              <p class="survey-detail-headerDec paddingTop">
                {{itemDetail.questionnaire.foreword}}
              </p>
            </div>
          </div>
          <div class="survey-detail-content">
            <ul>
              <li v-for="(item, index) in object" :key="index" class="li-item">
                <p class="answer-bottom title" :class="{'choice':item.requiredFlag}">{{index + 1}}、{{item.subject}} <span class="answer-type">({{type[item.type-1]}})</span></p>
                <p class="answer-bottom content" v-for="list in item.items" :key="list.type">
                  <label v-show="item.type===1">
                    <span class="span-before">{{list.itemNo}}</span>
                    <input type="radio" class="radio-class"
                    v-if="item.answerList[0].answer.indexOf(list.itemNo)>-1"
                    checked
                    :value="list.id" :name="list.questionId"
                    />
                    <input v-else type="radio" class="radio-class"
                    :value="list.id" :name="list.questionId"
                    />
                    <label :for="list.id">{{list.content}}</label>
                    <!-- <span>{{item.answerList[0].answer}}</span> -->
                  </label>
                  <label v-show="item.type===2">
                    <span class="span-before">{{list.itemNo}}</span>
                    <input type="checkbox"
                    v-if="item.answerList[0].answer.indexOf(list.itemNo)>-1"
                    checked
                    :value="list.itemNo"/>
                    <input v-else type="checkbox"
                    :value="list.itemNo"
                    />
                    <label>{{list.content}}</label>
                  </label>
                </p>
                <label v-show="item.type==3">
                  <p class="answer-bottom content" style="border: none">
                    <span>{{item.answerList[0].answer}}</span>
                  </p>
                </label>
                <label v-show="item.type==4">
                  <p class="answer-bottom star content" :data="index">
                    <star v-if="item.type==4" @selectStar="selectStar" :answer="item.answerList[0].answer"></star>
                  </p>
                </label>
              </li>
              <li class="li-item">
                <div class="survey-endDesc" v-if="itemDetail.questionnaire">
                  <p class="answer-bottom none">{{itemDetail.questionnaire.endword}}</p>
                </div>
                <div class="survey-Detfooter">
                  <div v-if="!viewFlag" class="confirm">
                    <span class="Detfooter-con">
                      <input type="checkbox" class="" v-model="anonymousFlag">
                      <span class="Detfooter left">匿名提交</span>
                    </span>
                    <button class="Detfooter right" @click="submitData">提交问卷</button>
                  </div>
                  <div v-else class="other">
                    <span class="other-text">
                      衷心的感谢您对本次调查的参与和支持，祝您工作顺利！
                    </span>
                    <p>感谢您的参与</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="loading-wrapper" v-show="itemDetail.length==0">
          <loading></loading>
        </div>
      </scroll>
    </div>
  </transition>
</template>
<script>
import axios from 'axios'
import {url, getUrlKey, getUrlId} from '../../api/api'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Star from 'base/star/star'
import {formatDate} from 'common/js/date'

export default {
  filters: {
    // 时间格式化过滤器
    dateTime(_date) {
      if (_date) {
        return formatDate(new Date(_date * 1000), "yyyy-MM-dd hh:mm:ss")
      } else {
        return ''
      }
    }
  },
  data() {
    return {
      showMulAnswer: '',
      url: '',
      type: ['单选题', '多选题', '问答题', '打分题'],
      itemDetail: [],
      checked: true,
      stars: '☆☆☆☆☆',
      picked: '',
      answer: [], // 答案
      checkAnswer: [], // 多选v-model
      textValue: [], // 文本框
      score: '', // 评价分数
      anonymousFlag: false,
      check: true,
      radio: '1',
      object: [],
      arr: null,
      subAnswer: [], // 最终答案汇总
      answerLen: null, // 题目总数
      doneflag: null,
      v_checked: false,
      viewFlag: false,
      mouseWheel: true,
    }
  },
  created() {
    this.doneflag = this.$route.query.doneflag
  },
  mounted() {
    this._initDetailList()
  },
  methods: {
    _initDetailList() {
      let surveyId = getUrlId('countId')
      let key = getUrlKey('s')
      this.url = url() + key
      let param = JSON.stringify({
        questionnaireid: surveyId
      })
      let params1 = {
        serviceCode: 'SVCQY11011',
        data: param
      }
      let params2 = {
        serviceCode: 'SVCQY11012',
        data: param
      }
      let req1 = axios.post(this.url, params1)
      let req2 = axios.post(this.url, params2)
      axios.all([req1, req2]).then(
        axios.spread((acct, perms) => {
          this.itemDetail = acct.data.data
          this.object = perms.data.data
          this.answerLen = this.object.length
          // console.log(acct)
          this.viewFlag = this.itemDetail.questionnaire.viewFlag
          // console.log(this.viewFlag)
          // console.log(perms)
        })
      ).catch((error) => {
        this.$toast.center(error)
      })
    },
    // 答案
    totalAnswer(index, id, answer, flag) {
      this.subAnswer[index] = {
        questionid: id, // 题目id
        answer: answer
      }
      let surveyId = getUrlId('countId')
      let params = JSON.stringify({
        questionnaireid: surveyId, // 试卷id
        anonymousFlag: this.anonymousFlag, // 是否匿名
        questions: this.subAnswer
      })
      this.arr = {
        serviceCode: 'SVCQY11013',
        data: params
      }
      // 答案
      this.answer[index] = {
        answer: answer
      }
      // console.log(this.answer)
    },
    // 多选
    multiSelect(index, id, answer, flag, list) {
      if (typeof list.checked === 'undefined') {
        this.$set(list, 'checked', true)
      } else {
        list.checked = !list.checked
      }
      if (list.checked === true) {
        if (this.showMulAnswer.indexOf(answer) === -1) {
          this.showMulAnswer = this.showMulAnswer + answer + ','
        }
      } else {
        if (this.showMulAnswer.indexOf(answer) !== -1) {
          this.showMulAnswer = this.showMulAnswer.replace(answer + '', '')
        }
      }
      let total = this.showMulAnswer.substring(0, this.showMulAnswer.length - 1)
      let totalArr = total.split(',').sort().toString()
      this.totalAnswer(index, id, totalArr, flag)
    },
    // 文本框
    textSub(index, id, flag) {
      let answer = this.textValue[index]
      this.totalAnswer(index, id, answer, flag)
    },
    selectStar(starNum) {
      this.score = starNum
    },
    // 星级评价
    resultScore(index, id) {
      let socre = this.score + '分'
      this.totalAnswer(index, id, socre)
    },
    // 提交试卷
    submitData() {
      for (let i = 0; i < this.answerLen; i++) {
        let flag = this.object[i].requiredFlag // 是否为必选
        let answer = this.answer[i]
        if (flag && answer === undefined) {
          this.$toast.center(`第 ${i + 1} 题是必选题哦!`)
          return
        }
      }
      axios.post(this.url, this.arr).then((res) => {
        if (res.data.code === 0) {
          this.$toast.center(`提交成功!`)
          this.$router.back()
        } else {
          this.$toast.center(res.data.msg)
        }
      }).catch((error) => {
        this.$toast.center(error)
      })
    }
  },
  components: {
    Scroll,
    Loading,
    Star,
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"
  .survey-detail
    position:absolute
    top: 0
    left:0
    width: 100%
    height: 100%
    background:#FFFFFF
    z-index: 2
    font-size:12px
    overflow:hidden
    .list-survey
      width: 100%
      height:100%
      .survey-detail-header
        padding:16px 0px
        border-bottom:1px solid #ccc
        .survey-head-width
          width: 90%
          margin: 0 auto
        .paddingTop
          padding-top:10px
          .header-title
            font-size:16px
            font-weight:bold
          .flex-item
            font-size:13px
        .flex
          display:flex
          justify-content:space-between
          color:#999
          font-size:12px
        .survey-detail-headerDec
          font-size:14px
          color:#666
      .survey-detail-content
        font-size:14px
        .li-item
          border-bottom:15px solid white
          .answer-bottom
            width: 90%
            margin:0 auto
            border-bottom: 1px dashed gainsboro
            padding: 10px 5px
            line-height:17px
            font-size: 14px
            .text-area
              width:100%
              height:70px
              border:1px solid gainsboro
          .content
            padding-left: 20px !important
          .choice
            &::before
              content:'*'
              color:red
           .answer-bottom
            width: 90%
            margin:0 auto
            border-bottom: 1px dashed gainsboro
            padding: 10px 0px
            .span-before
              padding-right:4px
          .title
            width:90%
            padding: 10px 0px
            .answer-type
              font-size:14px
              color:#999999
              margin-left:10px
          .star
            font-size: 26px
            color:#999
            border-bottom:1px dashed gainsboro
          .end
            width: 100%
            margin:0 auto
          .none
            border-bottom:none
            color:#666
          .survey-endDesc
            width: 100%
            border-bottom: 1px solid gainsboro
          .survey-Detfooter
            width:90%
            margin:10px auto
            display:flex
            justify-content:space-between
            .confirm
              display:flex
              justify-content:space-between
              width: 100%
              .Detfooter
                &.right
                  background:#68Ad05
                  border-radius: 5px
                  border:1px solid #68Ad05
                  color:white
                  padding:2px 8px
                  font-size:14px
                &.left
                  margin-top:-2px
            .other
              width: 100%
              font-size: 14px
              color: #999
              .other-text
                line-height: 18px
              &>p
                padding-top: 10px
    .loading-wrapper
      position:absolute
      width:100%
      height:100%
      margin:0 auto
      padding-top:80px
      background:#eee
      z-index:2
      top: 0
      left:0
</style>