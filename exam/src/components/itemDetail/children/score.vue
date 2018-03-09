<template>
  <div class="score-detail" >
    <div class="score-container">
      <div class="header">
        <!-- <span class="icon" @click="goBack"><i class="icon-left"></i></span> -->
        <span class="title">测试题库</span>
      </div>
      <div class="tip-move border-1px">
        <div class="circle" v-show="isShowMove">
          <span class="text">成绩</span>
          <div class="tip-score">{{totalScore}}</div>
        </div>
        <div class="belt" v-show="isShowBar">
          <div class="bar" v-if="isQuestionType">
            <p class="desc">填空题简答题待判分</p>
            <p class="text">最终分数拭目以待</p>
          </div>
          <div class="bar" v-else>
            <p class="desc">感谢您的参与</p>
            <p class="text">最终分数拭目以待</p>
          </div>
        </div>
        <div class="other">
          <p class="time">答题用时：{{allTime}}秒</p>
          <p class="qualified-score">合格分数：{{passscore}}分</p>
        </div>
      </div>
      <scroll class="answer-list" :data="answerList" :mouseWheel="mouseWheel">
        <ul>
          <li class="list" v-for="item in answerList">
            <div class="type-style" v-if="item.question.type == 1 || item.question.type == 2 || item.question.type == 3">
              <div class="mis" v-if="item.isCorrect == false">
                <span class="text">{{item.location}}</span>
                <span class="icon-tab_close"></span>
              </div>
              <div class="right" v-else-if="item.isCorrect == true">
                <span class="text">{{item.location}}</span>
                <span class="icon-miaojie_seller_selected"></span>
              </div>
            </div>
            <div v-else>
              <div class="reply">
                <span class="text">{{item.location}}</span>
                <span class="icon"><i class="icon-omit"></i></span>
              </div>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
    <div class="score-confirm">
      <button class="btn" @click="onConfirm">查看答案</button>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import {formatDate} from 'common/js/date'
  import { Toast } from 'vant'
  import *as api from 'api/api'
  import http from 'api/http'
  import Scroll from 'base/scroll/scroll'

  export default {
    data() {
      return {
        isShowMove: false,
        isShowBar: false,
        allTime: null,
        examid: null,
        answerList: [],
        totalScore: null, // 总分
        passscore: null, // 及格分
        isQuestionType: false,
        mouseWheel: true,
      }
    },
    created() {
      this.allTime = this.$route.query.allTime
      this.examid = this.$route.query.examid
      this.passscore = this.$route.query.passscore
    },
    computed: {
      ...mapGetters([
        'getSessionKey'
      ])
    },
    mounted() {
      this.getScoreData()
    },
    methods: {
      async getScoreData() {
        let params = {
          "examid": this.examid,
          "paperid": '',
        }
        let url = api.serviceUrl + this.getSessionKey
        const answerDetailDatas = await http.post(url, api.servicAnswerDetail, params)
        if (answerDetailDatas.data.code === api.ERR_OK) {
          this.answerList = answerDetailDatas.data.data.examItems
          // console.log(this.answerList)
          this.answerList.forEach((list) => {
            if (list.score != undefined) {
              // console.log(list.score)
              this.totalScore += list.score
            }
            if (list.question.type == 4 || list.question.type == 5) {
              this.isQuestionType = true
            }
          })
          this.timer = setTimeout(() => {
            clearInterval(this.timer)
            this.isShowMove = true
          }, 800)
          this.timerBar = setTimeout(() => {
            clearInterval(this.timerBar)
            this.isShowBar = true
          }, 1200)
        } else {
          Toast({
            duration: 1000,
            message: answerDetailDatas.data.msg
          })
        }
      },
      showMove() {
        this.isShowMove = !this.isShowMove
      },
      // 查看答案
      onConfirm() {

        this.$router.push({path:'scoreItem', query: {examid: this.examid}})
      },
      goBack() {
        this.$router.push('unExam')
      },
    },
    components: {
      Scroll,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  @keyframes tipMove
    0%
      transform: scale(1)
    35%
      transform: scale(.8)
    70%
      transform: scale(1.1)
    100%
      transform: scale(1)

  .score-detail
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    background: #fff
    z-index: 11
    .score-container
      .header
        width: 100%
        height: 40px
        background: #1E90FF
        text-align: center
        .title
          line-height: 40px
          font-size: $font-size-medium-x
          color: #fff
          font-weight: bold
        .icon
          position: absolute
          display: inline-block
          left: 0
          padding: 10px
          color: #fff
      .tip-move
        display: flex
        justify-content: center
        align-items: center
        width: 100%
        height: 250px
        border-1px(rgba(7, 17, 27, .1))
        .circle
          position: absolute
          width: 120px
          height: 120px
          margin-top: -35px
          animation: tipMove .5s
          background: rgb(255, 200, 47)
          border-radius: 50%
          text-align: center
          // transition: all 1s
          // opacity: 0
          .text
            display: inline-block
            line-height: 20px
            margin-top: 20px
            font-size: 14px
            color: #fff
          .tip-score
            margin-top: 10px
            line-height: 30px
            font-size: 40px
            color: #fff
        // .circle-on
        //   opacity: 1
        .belt
          position: absolute
          width: 230px
          height: 65px
          z-index: 1
          animation: tipMove .5s
          background-image: url(../../../../static/images/bar.png)
          background-repeat: no-repeat
          background-size: 100% 100%
          margin-top: 35px
          text-align: center
          // transition: all 1.5s
          // opacity: 0
          .bar
            padding: 5px 20px
            font-size: 12px
            color: #fff
            line-height: 16px
        // .belt-on
        //   opacity: 1
        .other
          margin-top: 210px
          text-align: center
          font-size: 12px
          color: #999
          line-height: 16px
      .answer-list
        position: absolute
        width: 100%
        top: 290px
        bottom: 46px
        overflow: hidden
        ul
          display: flex
          margin: 10px 10%
          flex-wrap: wrap
          .list
            flex: 0 0 40px
            width: 40px
            height: 40px
            margin: 5px
            line-height: 40px
            text-align: center
            .mis, .right, .reply
              width: 100%
              height: 100%
              border-radius: 5px
            .mis
              position: relative
              border: 1px solid #EE2C2C
              box-sizing: border-box
              .icon-tab_close
                position: absolute
                top: 25px
                left: 23px
                color: #EE2C2C
            .right
              position: relative
              border: 1px solid #32CD32
              box-sizing: border-box
              .icon-miaojie_seller_selected
                position: absolute
                top: 25px
                left: 24px
                font-size: 16px
                color: #32CD32
            .reply
              position: relative
              border: 1px solid #FFC125
              box-sizing: border-box
              .icon
                position: absolute
                display: flex
                justify-content: flex-end
                align-items: flex-end
                width: 16px
                height: 16px
                top: 23px
                left: 22px
                .icon-omit
                  display: flex
                  font-size: 12px
                  color: #FFC125
    .score-confirm
        position: fixed
        bottom: 0
        width: 100%
        height: 46px
        border-top: 1px solid rgba(7, 17, 27, .1)
        box-sizing: border-box
        text-align: center
        .btn
          width: 95%
          height: 38px
          margin: 4px 0
          background: #FFC125
          color: #fff
          font-size: $font-size-medium-x
          outline: none
          border: none
          border-radius: 3px
</style>
