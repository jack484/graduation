<template>
  <div class="detail">
    <div class="detail-container">
      <div class="header">
        <span class="title">{{paper.title}}</span>
      </div>
      <div class="detail-main">
        <div class="nav">
          <ul class="score-ul">
            <li class="score-desc">
              <span class="title">试卷总分：</span>
              <span class="text">{{paper.totalScore}}分</span>
            </li>
            <li class="score-desc">
              <span class="title">及格分：</span>
              <span class="text">{{paper.passScore}}分</span>
            </li>
            <li class="score-desc">
              <span class="title">总题数：</span>
              <span class="text">{{questionQty}}题</span>
            </li>
            <li class="score-desc">
              <span class="title">考试时长：</span>
              <span class="text">{{paper.longExam}}分钟</span>
            </li>
          </ul>
        </div>
        <div class="exam-time">
          <div class="time-head">
            <p class="line"></p>
            <span class="text">考试时间</span>
            <p class="line"></p>
          </div>
          <div class="time-desc">
            <span class="text">{{paper.validdateFrom | dateTime}} 至 {{paper.validdateTo | dateTime}}</span>
          </div>
        </div>
        <div class="exam-desc">
          <div class="desc-head">
            <p class="line"></p>
            <span class="text">考试说明</span>
            <p class="line"></p>
          </div>
          <div class="desc">
            <span class="text" v-html="description"></span>
          </div>
        </div>
      </div>
      <div class="confirm">
        <button class="btn" @click="onConfirm">开始答题</button>
      </div>
    </div>
    <transition name="router-slid" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
  import {mapMutations, mapActions, mapGetters} from 'vuex'
  import {formatDate, getUrlKey} from 'common/js/date'
  import { Toast } from 'vant'
  import *as api from 'api/api'
  import http from 'api/http'

  export default {
    filters: {
      // 时间格式化过滤器
      showTime(_time) {
        if (_time) {
          return formatDate(new Date(_time *1000), "yyyy-MM-dd")
        } else {
          return ''
        }
      },
      dateTime(_date) {
        if (_date) {
          return formatDate(new Date(_date *1000), "yyyy-MM-dd hh:mm:ss")
        } else {
          return ''
        }
      },
    },
    data() {
      return {
        examItem: '',
        questionQty: '', // 总题数
        paper: '', // 试卷说明信息
        description: '',
        pagingFlag: null, // 一页考试还是分页考试
        paperid: '', // 试卷ID
        passScore: '', // 及格分
        currentSessionKey: null,
        currentPaperid: '',
      }
    },
    created() {
      this.examItem = this.$route.query.examItem

      this.currentPaperid = getUrlKey('paperid')
      this.currentSessionKey = getUrlKey('s')
      if (this.currentSessionKey != null) {
        this.saveSessionKey(this.currentSessionKey)
      }
    },
    computed: {
      ...mapGetters([
        'getSessionKey'
      ])
    },
    mounted() {
      this.getData()
    },
    methods: {
      ...mapActions([
        'savePaperId', 'saveExamId', 'savePassScore', 'saveQuestionQty', 'saveSessionKey'
      ]),
      ...mapMutations([
        'SAVE_EXAMDETAIL'
      ]),
      async getData() {
        if (this.currentPaperid != null && this.currentSessionKey != null) {
          this.paperid = this.currentPaperid
        } else {
          this.paperid = this.examItem.id
        }
        let params = {
          "paperid": this.paperid,
        }
        let url = api.serviceUrl + this.getSessionKey
        const examDescData = await http.post(url, api.servicEexamDesc, params)
        if (examDescData.data.code === api.ERR_OK) {
          this.paper = examDescData.data.data.paper
          this.description = examDescData.data.data.paper.description
          this.questionQty = examDescData.data.data.questionQty
          this.pagingFlag = examDescData.data.data.paper.pagingFlag
          this.passScore = this.paper.passScore
          // console.log(this.paper)
          // console.log(this.pagingFlag)
          // console.log(this.passScore)
          this.savePassScore(this.passScore)
          this.saveQuestionQty(this.questionQty)
        } else {
          Toast({
            duration: 1000,
            message: examDescData.data.msg
          })
        }
      },
      // 时间格式化
      showDateTime(_date) {
        if (_date) {
          return formatDate(new Date(_date *1000), "yyyy-MM-dd hh:mm:ss")
        } else {
          return ''
        }
      },
      onConfirm() {
        let timer = this.showDateTime(this.paper.validdateFrom)
        let _timer = this.showDateTime(this.paper.validdateTo)
        let startTime = new Date(timer)
        let endTime = new Date(_timer)
        let nowTime = new Date()
        if (nowTime.getTime() - startTime.getTime() < 0) {
          Toast({
            duration: 1000,
            message: '考试时间未到'
          })
        } else if (nowTime.getTime() - endTime.getTime() >0) {
          Toast({
            duration: 1500,
            message: '考试时间已过，下次请及时参加'
          })
        } else {
          this.$router.push({path:'/answerList', query: {longexam: this.paper.longExam, paperid: this.paperid, questionQty: this.questionQty, passscore: this.passScore}}) // 分页答题
        }


        // if (this.pagingFlag == false) {
        //   this.$router.push({path:'/answerList', query: {longexam: this.examItem.longexam, paperid: this.examItem.id, questionQty: this.questionQty, passscore: this.passScore}}) // 分页答题
        // } else {
        //   // this.$router.push('answerFull') // 整页答题
        //   this.$router.push({path: '/answerFull', query: {longexam: this.examItem.longexam, paperid: this.examItem.id}})
        // }
      },
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .detail
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    background: #fff
    .detail-container
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
      .detail-main
        width: 100%
        .nav
          margin: 10px 18px
          .score-ul
            display: flex
            flex-wrap: wrap
            .score-desc
              flex: 0 0 50%
              width: 50%
              padding: 10px 0
              line-height: 20px
              .title
                font-size: $font-size-medium
                color: $color-dialog-background-x
              .text
                font-size: $font-size-medium
                color: $color-dialog-background
        .exam-time, .exam-desc
          margin: 10px 18px
          .time-head, .desc-head
            display: flex
            width: 100%
            .text
              flex: 0 0 60px
              width: 60px
              line-height: 30px
              margin: 0 15px
              text-align: center
              font-size: $font-size-medium
              color: $color-dialog-background-x
            .line
              flex: 1
              margin: auto
              height: 5px
              border-top: 1px solid rgba(7, 17, 27, .1)
              border-bottom: 1px solid rgba(7, 17, 27, .1)
          .time-desc, .desc
            width: 100%
            min-height: 100px
            .text
              display: inline-block
              padding-top: 10px
              font-size: $font-size-medium
      .confirm
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
    .router-slid-enter-active, .router-slid-leave-active
      transition: all .3s
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(30px, 0, 0)
      opacity: 0
</style>
