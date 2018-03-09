<template>
  <scroll ref="scroll" class="score-detail" :data="answerList" :mouseWheel="mouseWheel">
    <div class="score-container">
      <ul class="score-ul">
        <li class="score-list" v-for="(item, index) in answerList">
          <span class="title"><span>{{index+1}}、</span>{{item.subject}}
            <span style="font-size: 12px; color: #999" v-if="item.type==1">（单选题）</span>
            <span style="font-size: 12px; color: #999" v-else-if="item.type==2">（多选题）</span>
            <span style="font-size: 12px; color: #999" v-else-if="item.type==3">（判断题）</span>
            <span style="font-size: 12px; color: #999" v-else-if="item.type==4">（填空题）</span>
            <span style="font-size: 12px; color: #999" v-else>（简答题）</span>
          </span>
          <ul class="score-list-ul border-1px" v-if="item.type==1 || item.type==2">
            <li class="score-list-detail"  v-for="(list, key) in item.items" ref="list">
              <span class="icon-circle" :class="{'icon-check-circle': item.answer.indexOf(list.itemNo)>-1}"></span>
              <span class="option-num">{{list.itemNo}}、</span>
              <span class="text">{{list.content}}</span>
            </li>
          </ul>
          <!-- 判断题 -->
          <div v-if="item.type==3" class="gap-detail border-1px">
            <div class="right" @click="judgeBoole('right', item)">
              <span class="icon-circle" :class="{'icon-check-circle': item.answer == 'true'}"></span>
              <span class="text">对</span>
            </div>
            <div class="error" @click="judgeBoole('error', item)">
              <span class="icon-circle" :class="{'icon-check-circle': item.answer == 'false'}"></span>
              <span class="text">错</span>
            </div>
          </div>
          <div class="right-answer" v-if="item.type==1 || item.type==2 || item.type==3">
            <div v-if="item.type==3">
              <span class="text" v-if="item.type==3 && item.correctAnswer == 'true'">正确答案【对】</span>
              <span class="text" v-else>正确答案【错】</span>
            </div>
            <span v-else class="text">正确答案【{{item.selFlag}}】</span>
            <div class="answer-desc">
              <span class="desc">解析</span>
              <span class="desc-text">{{item.description}}</span>
            </div>
          </div>
          <div class="right-answer" v-if="item.type == 4 || item.type == 5">
            <div class="reply-content">
              <p class="reply">{{item.answer}}</p>
            </div>
            <div class="answer-desc">
              <span class="desc">解析</span>
              <span class="desc-text">{{item.description}}</span>
            </div>
          </div>
        </li>
        <!-- <div class="go-back">
          <button @click="goBack">返回首页</button>
        </div> -->
      </ul>
    </div>
  </scroll>
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex'
  import Scroll from 'base/scroll/scroll'
  import { Toast } from 'vant'
  import *as api from 'api/api'
  import http from 'api/http'
  import {formatDate} from 'common/js/date'

  export default {
    data() {
      return {
        paperid: null,
        examid: null,
        answerList: [],
        mouseWheel: true,
      }
    },
    created() {
      this.paperid = this.$route.query.paperid
      this.examid = this.$route.query.examid
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
      async getData() {
        let params = {
          "examid": this.examid || '',
          "paperid": this.paperid || ''
        }
        let url = api.serviceUrl + this.getSessionKey
        const answerDetailData = await http.post(url, api.servicAnswerDetail, params)
        // console.log(answerDetailData)
        if (answerDetailData.data.code === api.ERR_OK) {
          let resultList = answerDetailData.data.data.examItems
          // console.log(resultList)
          // 将数据转成方便使用的
          if (resultList) {
            for (let i = 0; i < resultList.length; i++) {
              let _selFlag = []
              if (resultList[i].question.items.length>0) {
                for (let j = 0; j < resultList[i].question.items.length; j++) {
                  if (resultList[i].question.items[j].selFlag == true) {
                      _selFlag.push(resultList[i].question.items[j].itemNo)
                    }
                }
              }
              this.answerList.push({
                id:resultList[i].examid,
                answer:resultList[i].answer,
                correctAnswer: resultList[i].question.answer,
                selFlag: _selFlag.toString(),
                isCorrect: resultList[i].isCorrect,
                type: resultList[i].question.type,
                items: resultList[i].question.items,
                subject: resultList[i].question.subject,
                description: resultList[i].question.description
              })
            }
          }
          // console.log(this.answerList)
        } else {
          Toast({
            duration: 1000,
            message: answerDetailDatas.data.msg
          })
        }
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
        .title
          line-height: 18px
          font-size: 16px
          color: #333
        .score-list-ul
          padding: 10px 0
          border-1px(rgba(7, 17, 27, .1))
          .score-list-detail
            display: flex
            padding: 10px 0
            font-size: 14px
            color: #666
            .status
              margin-right: 5px
            .icon-circle
              margin-right: 10px
              font-size: 16px
            .icon-check-circle
              font-size: 16px
              color: #ccc !important
        .gap-detail, .reply-detail
          margin-top: 10px
          border-1px(rgba(7, 17, 27, .1))
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
              color: #ccc !important
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
        .right-answer
          padding: 10px 0
          .text
            font-size: 14px
            color: #66CD00
            line-height: 18px
          .answer-desc
            display: flex
            padding-top: 5px
            .desc
              flex: 0 0 40px
              width: 40px
              height: 25px
              line-height: 25px
              text-align: center
              background: #ccc
              border-radius: 3px
              font-size: 14px
              color: #F7F7F7
            .desc-text
              flex: 1
              margin-left: 5px
              line-height: 25px
              font-size: 14px
              color: #666
          .reply-content
            width: 100%
            padding: 10px 0
            background: #f2f5f7
            .reply
              padding: 0 10px
              font-size: 14px
      .go-back
        width: 100%
        text-align: center
        margin: auto
        height: 35px
        background: #fff
        button
          width: 50%
          height: 100%
          outline: none
          background: #ffc125
          color: #fff
          border: none
</style>
