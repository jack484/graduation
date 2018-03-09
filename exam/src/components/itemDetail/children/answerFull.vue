<template>
  <scroll ref="scroll" class="score-detail" :data="examList" :mouseWheel="mouseWheel">
    <div class="score-container">
      <div class="timer-content">
        <div class="timer">
          <span>剩余时间：</span><span>{{minutes}}分{{seconds}}秒</span>
        </div>
      </div>
      <ul class="score-ul">
        <li class="score-list" v-for="(item, index) in examList">
          <span class="title"><span>{{index+1}}、</span>{{item.question.subject}}</span>
          <!-- 单选 -->
          <ul class="score-list-ul" v-if="item.question.type==1">
            <li class="score-list-detail"  v-for="(list, index) in item.question.items"  @click="inputResult(index, list.itemNo, list.questionId, list, item, list.id)">
              <input type="radio"  :id="list.id" :value="list.id"  :name="list.questionId">
              <label :for="list.id"></label>
              <span class="option-num">{{list.itemNo}}、</span>
              <span class="text">{{list.content}}</span>
            </li>
          </ul>
          <!-- 多选 -->
          <ul class="score-list-ul" v-if="item.question.type==2">
            <li class="score-list-detail"  v-for="(list, index) in item.question.items" @click="selectCheckBox(index, list.itemNo, list.questionId, list, item)">
              <span class="icon-circle" :class="{'icon-check-circle': list.checked}"></span>
              <span class="option-num">{{list.itemNo}}、</span>
              <span class="text">{{list.content}}</span>
            </li>
          </ul>
          <!-- 判断题 -->
          <div v-if="item.question.type==3" class="gap-detail">
            <div class="right" @click="judgeBoole('right',index, item.questionid, item)">
              <input class="ipt" type="radio"  :id="item.id" :value="item.id"  :name="index">
              <label :for="item.id"></label>
              <span class="text">对</span>
            </div>
            <div class="error" @click="judgeBoole('error',index, item.questionid, item)">
              <input class="ipt" type="radio"  :id="item.id" :value="item.id"  :name="index">
              <label :for="item.id"></label>
              <span class="text">错</span>
            </div>
          </div>
          <!-- 填空题 -->
          <div v-if="item.question.type==4" class="gap-detail">
            <div class="textarea border-1px">
              <textarea rows="8" v-model.trim='item.userReply'></textarea>
            </div>
          </div>
          <!-- 简答题 -->
          <div v-if="item.question.type==5" class="reply-detail">
            <div class="textarea border-1px">
              <textarea rows="8" v-model.trim="item.userReply"></textarea>
            </div>
          </div>
        </li>
      </ul>
      <div class="confirm">
        <button class="btn" @click="onConfirm">提交试卷</button>
      </div>
    </div>
    <div class="none-time" v-if="isShowNoTime">
      <div class="content">
        <p class="text">考试时间已到</p>
        <button class="submit" @click="submitNoTime">提交试卷</button>
      </div>
    </div>
  </scroll>
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex'
  import Scroll from 'base/scroll/scroll'
  import {formatDate} from 'common/js/date'
  import { Toast } from 'vant'
  import *as api from 'api/api'
  import http from 'api/http'

  export default {
    data() {
      return {
        pickedRadio: [],
        examList: [],
        choosedAnswer: '', // 选中的答案
        choosedNum: [], // 选中索引号
        isAction: false,
        answerArray: [],
        replyValue: [],
        multiChoose: '',
        questionId: '',
        _userReply: '',
        examItems: [],
        longexam: null, // 考试时间
        examid: null, // 考卷ID
        minutes: null, // 分
        seconds: null, // 秒
        allTime: null, // 考试用时
        isShowNoTime: false,
        mouseWheel: true,
      }
    },
    created() {
      this.paperid = this.$route.query.paperid // 试卷ID
      this.longexam = this.$route.query.longexam
      // console.log(this.paperid)
    },
    computed: {
      ...mapState([
        'examAnswer',
      ]),
      ...mapGetters([
        'getSessionKey', 'getPassScore'
      ])
    },
    mounted() {
      this.getData()
      this.countTime()
      this.timer = setInterval(() => {
        this.allTime++
      }, 1000)
    },
    methods: {
      async getData() {
        let params = {
          "paperid": this.paperid,
        }
        let url = api.serviceUrl + this.getSessionKey
        const examDatas = await http.post(url, api.servicEexamList, params)
        // console.log(examDatas)
        if (examDatas.data.code === api.ERR_OK) {
          // console.log(examDatas.data.data)
          this.examList = examDatas.data.data.examItems
          this.examid = examDatas.data.data.id
        } else {
          Toast({
            duration: 1000,
            message: examDatas.data.msg
          })
        }
      },
      // 单选
      inputResult(index, itemNo, questionId, list, item) {
        this.choosedAnswer = itemNo
        item['userReply'] = this.choosedAnswer
        // console.log(item)
      },
      // 多选
      selectCheckBox(index, itemNo, questionId, list, item) {
        if(typeof list.checked == 'undefined'){
          this.$set(list,'checked',true)
        }else{
          list.checked = !list.checked
        }
        if (list.checked == true) {
          if (this.multiChoose.indexOf(itemNo) == -1) {
            this.multiChoose = this.multiChoose + itemNo + ","
          }
        } else {
          if (this.multiChoose.indexOf(itemNo) != -1) {
            this.multiChoose = this.multiChoose.replace(itemNo + ",", '')
          }
        }

        item['userReply'] = this.multiChoose
      },
      // 判断题
      judgeBoole(s, index, id, list) {
        if (s == 'right') {
          this.judgeBooles = true
        }
        if (s == 'error') {
          this.judgeBooles = false
        }
        list['userReply'] = this.judgeBooles.toString()
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
        let url = api.serviceUrl + this.getSessionKey
        const answerDatas = await http.post(url, api.servicEexamAnswer, params)
        if (answerDatas.data.code === api.ERR_OK) {
          Toast({
            duration: 1000,
            message: '提交成功'
          })
          this.$router.push({path:'/score', query: {allTime: this.allTime, examid: this.examid, passscore: this.getPassScore}})
        } else {
          Toast({
            duration: 1000,
            message: answerDatas.data.msg
          })
        }
      },
      async submitNoTime(){
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
        let url = api.serviceUrl + this.getSessionKey
        const answerDatas = await http.post(url, api.servicEexamAnswer, params)
        if (answerDatas.data.code === api.ERR_OK) {
          Toast({
            duration: 1000,
            message: '提交成功'
          })
          this.$router.push({path:'/score', query: {allTime: this.allTime, examid: this.examid, passscore: this.getPassScore}})
        } else {
          Toast({
            duration: 1000,
            message: answerDatas.data.msg
          })
        }
      },
       // 倒计时
      countTime () {
        let maxTime = this.longexam *60-1
        setInterval(() => {
          if (maxTime >= 0) {
            this.minutes = Math.floor(maxTime / 60)
            this.seconds = Math.floor(maxTime % 60)
            --maxTime
            // console.log(this.minutes)
            // console.log(this.seconds)
            if (this.minutes == 0 && this.seconds == 0) {
              this.isShowNoTime = true
            }
          }
        }, 1000)
      }
    },
    components: {
      Scroll,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .score-detail
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    background: #f2f5f7
    .score-container
      .score-list
        margin-bottom: 10px
        padding: 10px 18px
        background: #fff
        &:last-child
          padding-bottom: 20px
        .title
          margin-bottom: 10px
          line-height: 24px
          font-size: $font-size-medium
        .score-list-ul
          padding: 10px 0
          .score-list-detail
            position: relative
            margin-bottom: 10px
            padding: 10px
            border: 1px solid rgba(7, 17, 27, .1)
            border-radius: 5px
            input[type='radio']
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
            position: relative
            padding: 10px 0
            // input[type="radio"]
            //   width: 16px
            //   height: 16px
            //   opacity: 0
            // label
            //   position: absolute
            //   left: 0
            //   top: 12px
            //   width: 16px
            //   height: 16px
            //   border-radius: 50%
            //   border: 1px solid #999
            // input:checked+label
            //   background-color: rgb(104, 173, 5)
            //   border: 1px solid rgb(104, 173, 5)
            // input:checked+label::after
            //   position: absolute
            //   content: ""
            //   width: 5px
            //   height: 10px
            //   top: 0px
            //   left: 4px
            //   border: 2px solid #fff
            //   border-top: none
            //   border-left: none
            //   transform: rotate(45deg)
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
      .confirm
        width: 100%
        height: 46px
        border-top: 1px solid rgba(7, 17, 27, .1)
        box-sizing: border-box
        text-align: center
        background: #fff
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
