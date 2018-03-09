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
              <span class="text">{{paper.totalScore}} 分</span>
            </li>
            <li class="score-desc">
              <span class="title">及格分：</span>
              <span class="text">{{paper.passScore}} 分</span>
            </li>
            <li class="score-desc">
              <span class="title">总题数：</span>
              <span class="text">{{questionQty}} 题</span>
            </li>
            <li class="score-desc">
              <span class="title">考试时长：</span>
              <span class="text">{{paper.longExam}} 分钟</span>
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
            <span class="text" v-html="paper.description"></span>
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
  import {mapActions,} from 'vuex'
  import {formatDate} from 'common/js/date'
  import { Toast } from 'vant'
  import *as api from 'api/api'
  import http from 'api/http'
  import {getUrlKey} from 'common/js/getSessionKey'

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
        examItem: null,
        questionQty: null, // 总题数
        paper: '', // 试卷说明信息
        description: null,
        pagingFlag: null, // 一页考试还是分页考试
        longexam: null, // 考试时长
        paperid: null, // 试卷ID
        examList: null, // 题目详情
        passScore: null, // 及格分
        currentPaperid: '', // 接收url的id
        currentSessionKey: null,
      }
    },
    created() {
      this.currentPaperid = getUrlKey('paperid')
      this.currentSessionKey = getUrlKey('s')
      if (this.currentSessionKey != null) {
        this.saveSessionKey(this.currentSessionKey)
      }
      // console.log(this.currentPaperid)
      // console.log(this.currentSessionKey)
    },
    mounted() {
      this.getData()
    },
    methods: {
      ...mapActions([
        'saveSessionKey'
      ]),
      async getData() {
        let params = {
          "paperid": this.currentPaperid,
        }
        let url = api.serviceUrl + this.currentSessionKey
        const examDescData = await http.post(url, api.servicEexamDesc, params)
        // console.log(examDescData)
        if (examDescData.data.code === api.ERR_OK) {
          this.paper = examDescData.data.data.paper
          this.questionQty = examDescData.data.data.questionQty
          // this.pagingFlag = examDescData.data.data.paper.pagingFlag
          // this.passScore = this.paper.passScore
          // console.log(this.paper)
          // console.log(this.paper.status)
        } else {
          Toast({
            duration: 1000,
            message: examDescData.data.msg
          })
        }
      },
      onConfirm() {
        this.$router.push({path:'/examList', query: {status: this.paper.status,paperid: this.currentPaperid, questionQty: this.questionQty, longExam: this.paper.longExam}})
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
