<template>
  <div class="answer-page">
    <div class="answer-container">
      <div class="timer-content">
        <div class="timer">
          <span>剩余时间：</span><span>{{minutes}}分{{seconds}}秒</span>
        </div>
        <div class="num-tip">
          <span class="num-length">{{itemNum}}/{{questionQty}}</span>
        </div>
      </div>
      <div class="answer-list">
        <header class="title">{{itemNum}}、{{examList[itemNum-1].question.subject}}<span style="font-size: 12px; color: #999" v-if="examList[itemNum-1].question.type==1">（单选题）</span>
          <span style="font-size: 12px; color: #999" v-else-if="examList[itemNum-1].question.type==2">（多选题）</span>
          <span style="font-size: 12px; color: #999" v-else-if="examList[itemNum-1].question.type==3">（判断题）</span>
          <span style="font-size: 12px; color: #999" v-else-if="examList[itemNum-1].question.type==4">（填空题）</span>
          <span style="font-size: 12px; color: #999" v-else>（简答题）</span>
        </header>
        <!-- 单选 -->
        <ul v-if="examList[itemNum-1].question.type==1">
          <li class="list" v-for="(item, index) in examList[itemNum-1].question.items" @click="choosed(index, item.itemNo)">
            <span class="icon-circle" :class="{'icon-check-circle': examList[itemNum-1].userReply==item.itemNo}"></span>
            <span class="option-num">{{item.itemNo}}、</span>
            <span class="option-detail">{{item.content}}</span>
          </li>
        </ul>
        <!-- 多选 -->
        <ul v-if="examList[itemNum-1].question.type==2">
          <li class="list" v-for="(item, index) in examList[itemNum-1].question.items" @click="selectCheckBox($event, index, item.itemNo, item)">
            <!-- <span class="icon-circle" ref="iconCricle" :class="{'icon-check-circle': (multiChoose.indexOf(item.itemNo)>-1)}"></span> -->
            <span class="icon-circle" :class="{'icon-check-circle': item.checked}"></span>
            <span class="option-num">{{item.itemNo}}、</span>
            <span class="option-detail">{{item.content}}</span>
          </li>
        </ul>
        <!-- 判断题 -->
        <div v-if="examList[itemNum-1].question.type==3" class="gap-detail">
          <div class="right" @click="judgeBoole('right')">
            <span class="icon-circle" :class="{'icon-check-circle': examList[itemNum-1].userReply == 'true'}"></span>
            <span class="text">对</span>
          </div>
          <div class="error" @click="judgeBoole('error')">
            <span class="icon-circle" :class="{'icon-check-circle': examList[itemNum-1].userReply == 'false'}"></span>
            <span class="text">错</span>
          </div>
        </div>
        <!-- 填空题 -->
        <div v-if="examList[itemNum-1].question.type==4" class="gap-detail">
          <div class="textarea border-1px">
            <textarea rows="8" v-model.trim="examList[itemNum-1].userReply"></textarea>
          </div>
        </div>
        <!-- 简答题 -->
        <div v-if="examList[itemNum-1].question.type==5" class="reply-detail">
          <div class="textarea border-1px">
            <textarea rows="8" v-model.trim="examList[itemNum-1].userReply"></textarea>
          </div>
        </div>
      </div>
      <div class="btn-wrapp">
        <div class="first-item" v-if="itemNum == 1" @click="nextItem">
          <span class="first">下一题</span>
        </div>
        <div class="other-item" v-else>
          <span class="prev" @click="prevItem">上一题</span>
          <div class="next">
            <span class="next-item" @click="nextItem" v-if="itemNum < questionQty">下一题</span>
            <div class="submit" v-else>
              <span @click="goBack">返回</span>
              <!-- <span v-else @click="onConfirm">提交试卷</span> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapMutations, mapState, mapActions, mapGetters} from 'vuex'
  import {formatDate} from 'common/js/date'
  import { Toast } from 'vant'
  import *as api from 'api/api'
  import http from 'api/http'

  export default {
    data() {
      return {
        title: null,
        allTime: 0, // 总共用时
        timer: null, // 定时器
        longExam: null, // 考试时长
        paperid: null, // 试卷ID
        questionQty: 0, // 总题数
        passscore: null, // 及格分数
        choosedNum: null, //选中答案索引
        choosedId:null, //选中答案id
        answerValue: [], // 填空题
        replyValue: [], // 简答题
        multiChoose: '', // 多选
        judgeBooles: null, // 判断题
        minutes: null, // 分
        seconds: null, // 秒
        isAction: false,
        itemNum: 1, // 第几题
        questionId: [],
        // examItems: [{'question':[]}],
        examList: [{'question':{}}],
        answerList: [],
        isShowNoTime: false, // 考试时间到
        examList: [],
        _status: null,
        isShowConfirm: true,
      }
    },
    created() {
      this.paperid = this.$route.query.paperid
      this._status = this.$route.query.status
      this.questionQty = this.$route.query.questionQty
      this.longExam = this.$route.query.longExam
      // console.log(this.paperid)
      // console.log(this._status)
      // console.log(this.longExam)
    },
    computed: {
      ...mapGetters([
        'getSessionKey'
      ])
    },
    mounted() {
      this.timer = setInterval(() => {
        this.allTime++
      }, 1000)
      this.countTime()
      this.getData()
    },
    methods: {
      async getData() {
        let params = {
          "paperid": this.paperid,
        }
        let url = api.serviceUrl + this.getSessionKey
        const examlistDatas = await http.post(url, api.servicEexamList, params)
        // console.log(examlistDatas)
        if (examlistDatas.data.code === api.ERR_OK) {
          // console.log(examlistDatas.data.data)
          this.examList = examlistDatas.data.data.examItems
          this.examid = examlistDatas.data.data.id
          // console.log(this.examList)
        } else {
          Toast({
            duration: 1000,
            message: examlistDatas.data.msg
          })
        }
      },
      ...mapActions([
        'saveAllTime',
      ]),
      // 下一题
      nextItem() {
        let _checkHint = '' // 校验
        if (this.examList[this.itemNum-1].userReply == null || this.examList[this.itemNum-1].userReply == undefined || this.examList[this.itemNum-1].userReply == "") {
          _checkHint = '请选择答案' // 错误异常提示
        }
        if (_checkHint) {
          Toast({
            duration: 1000,
            message: _checkHint
          })
        } else {
          // 记录答案
          this.itemNum ++ // 跳到下一题
        }
      },
      // 上一题
      prevItem() {
        this.itemNum--
      },
      // 单选
      choosed(index, itemNo) {
        this.choosedNum = itemNo
        this.examList[this.itemNum-1].userReply = itemNo
      },
      // 多选
      selectCheckBox(event, index, itemNo, item) {
        if(typeof item.checked == 'undefined'){
          this.$set(item,'checked',!item.checked)
        }else{
          item.checked = !item.checked
        }
        if (item.checked == true) {
          if (this.multiChoose.indexOf(itemNo) == -1) {
            this.multiChoose = this.multiChoose + itemNo + ","
          }
        } else {
          if (this.multiChoose.indexOf(itemNo) != -1) {
            this.multiChoose = this.multiChoose.replace(itemNo + ",", '')
          }
        }
        this.examList[this.itemNum-1].userReply = this.multiChoose
      },
      // 判断题
      judgeBoole(s) {
        this.choosedNum = s
        this.isAction = s
        if (s == 'right') {
          this.judgeBooles = true
        }
        if (s == 'error') {
          this.judgeBooles = false
        }
        this.examList[this.itemNum-1].userReply = this.judgeBooles.toString()
      },
      async onConfirm() {
        let examItems = []
        for(let i=0; i<this.examList.length; i++) {
          examItems.push({
            'questionid': this.examList[i].questionid,
            'answer':this.examList[i].userReply || ''
          })
        }
        let params = {
          "examid": this.examid,
          "examItems": examItems,
        }
        clearInterval(this._timer)
        // console.log(params)
        // return
      },
      goBack() {
        this.$router.go(-1)
      },
      // 倒计时
      countTime () {
        let maxTime = this.longExam *60-1
        this._timer = setInterval(() => {
          if (maxTime >= 0) {
            this.minutes = Math.floor(maxTime / 60)
            this.seconds = Math.floor(maxTime % 60)
            --maxTime
            // console.log(this.minutes)
            // console.log(this.seconds)
          }
        }, 1000)

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .answer-page
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    background: #fff
    .answer-container
      .timer-content
        display: flex
        justify-content: space-between
        align-items: center
        padding: 0 18px
        height: 40px
        background: rgb(255, 251, 203)
        .timer, .num-tip
          line-height: 40px
          font-size: $font-size-medium
          color: #FF7F00
      .answer-list
        margin: 10px 18px
        .title
          margin-bottom: 10px
          line-height: 24px
          font-size: $font-size-medium
        .list
          position: relative
          margin-bottom: 10px
          padding: 10px
          border: 1px solid rgba(7, 17, 27, .1)
          border-radius: 5px
          input[type='checkbox']
            width: 16px
            height: 16px
            opacity: 0
          label
            position: absolute
            left: 10px
            top: 12px
            width: 16px
            height: 16px
            border-radius: 50%
            border: 1px solid #999
          input:checked+label
            background-color: rgb(104, 173, 5)
            border: 1px solid rgb(104, 173, 5)
          input:checked+label::after
            position: absolute
            content: ""
            width: 5px
            height: 10px
            top: 0px
            left: 4px
            border: 2px solid #fff
            border-top: none
            border-left: none
            transform: rotate(45deg)
          .option-style
            display: inline-block
            width: 26px
            height: 26px
            line-height: 26px
            text-align: center
            border: 1px solid rgba(7, 17, 27, .1)
            border-radius: 50%
            font-size: $font-size-medium
            color: #333
            &.has-choosed
              background-color: #FF7F00
              color: #fff
              border: 1px solid #fff
          .option-detail, .option-num
            display: inline-block
            line-height: 16px
            margin-left: 5px
            font-size: $font-size-medium
            color: #333
          .icon-circle
            font-size: 16px
          .icon-check-circle
            font-size: 16px
            color: rgb(104, 173, 5) !important
        .gap-detail, .reply-detail
          margin-top: 10px
          .option-detail
            display: inline-block
            font-size: 14px
            line-height: 20px
            padding-bottom: 10px
          .right, .error
            padding: 10px 0
            .icon-circle
              font-size: 16px
            .icon-check-circle
              font-size: 16px
              color: rgb(104, 173, 5) !important
          .textarea
            // border-1px(rgba(7, 17, 27, .1))
            & > textarea
              width: 100%
              padding: 15px
              font-size: 14px
              line-height: 20px
              color: #666
              border: 1px solid rgba(7, 17, 27, .1)
              box-sizing: border-box
              resize: none
              outline: none
      .btn-wrapp
        position: fixed
        bottom: 0
        width: 100%
        height: 40px
        border-top: 1px solid rgba(7, 17, 27, .1)
        box-sizing: border-box
        .first-item
          width: 95%
          height: 32px
          margin: 4px auto
          background: #1e90ff
          outline: none
          border: none
          border-radius: 3px
          text-align: center
          .first
            line-height: 32px
            color: #fff
            font-size: $font-size-medium-x
        .other-item
          display: flex
          .prev, .next
            flex: 1
            background: #1e90ff
            margin-left: 18px
            margin-top: 5px
            margin-bottom: 5px
            line-height: 30px
            text-align: center
            border-radius: 3px
            color: #fff
          .next
            margin-right: 18px
          .submit
            display: inline-block
            width: 100%
            height: 100%
            background: #FF7F00
            border-radius: 3px
    .none-time
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      overflow: hidden
      background: rgba(7, 17, 27, .6)
      z-index: 111
      .content
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
        background: #fff
        // padding: 15px 18px
        width: 50%
        text-align: center
        .text
          font-size: 16px
          line-height: 30px
          padding-bottom: 10px
          padding-top: 10px
          color: #999
        .submit
          width: 100%
          height: 40px
          border: none
          outline: none
          color: #333
</style>
