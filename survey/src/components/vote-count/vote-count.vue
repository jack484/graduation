<template>
  <transition name="slider">
    <div class="vote-detail">
      <scroll class="list-vote" :data="object" :mouseWheel="mouseWheel">
        <div class="vote-detail-wrapper">
          <!--头部-->
          <div class="vote-detail-header" v-if="itemDetail.questionnaire">
            <div class="vote-header-width">
              <p class="paddingTop">
                <span class="header-title">{{itemDetail.questionnaire.name}}</span>
              </p>
              <p class="flex paddingTop">
                <span class="flex-item">截止时间：{{itemDetail.questionnaire.validTo | dateTime}}</span>
                <span class="flex-item text-right">参与人数：{{itemDetail.questionnaire.replyQty}}</span>
              </p>
              <p class="vote-detail-headerDec paddingTop">
                {{itemDetail.questionnaire.foreword}}
              </p>
            </div>
          </div>
          <div class="vote-detail-content">
            <div class="vote-content-width">
              <ul>
                <li v-for="(item, index) in object" :key="index" class="li-item"  v-show="item.type<3">
                  <p class="answer-bottom title">
                    {{index + 1}}、{{item.subject}}
                    <span class="answer-type">({{type[item.type-1]}})</span>
                  </p>
                  <p class="answer-bottom" v-for="(list, listIndex) in item.items" :key="listIndex">
                    <label v-show="item.type===1">
                      <span class="span-before">选项{{listIndex+1}}</span>
                      <vm-progress class="progress-wrapper" track-color="#fff"
                        :percentage="(list.rate)*100"
                        :stroke-color="color[colorNum+listIndex]"
                        :stroke-width="10">
                      <span class="progress">
                        {{list.selPersons}}人&nbsp;({{(list.rate)*100}}%)
                      </span>
                      </vm-progress>
                    </label>
                    <label v-show="item.type===2">
                      <span class="span-before">选项{{listIndex+1}}</span>
                      <vm-progress
                      :stroke-width="10"
                      :percentage="(list.rate)*100"
                      :stroke-color="color[colorNum+listIndex]" track-color="#fff">
                        <span class="progress">
                          {{list.selPersons}}人&nbsp;({{(list.rate)*100}}%)
                        </span>
                      </vm-progress>
                    </label>
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <!--底部-->
          <div class="footer">
            <div class="footer-desc" v-if="itemDetail.questionnaire">
              <p>{{itemDetail.questionnaire.endword}}</p>
            </div>
            <div class="vote-status">
              <p>
                <button class="vote-flag">已投票</button>
              </p>
            </div>
            <div class="vote-person">
              <p class="vote-icon">
                <i class="iconfont icon-toupiao1 icon-bar"></i>
                 已投票
              </p>
              <p class="vote-user">{{votePerson.usernames}} </p>
            </div>
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
import Scroll from '../../base/scroll/scroll'
import Loading from '../../base/loading/loading'
import {url, getUrlId, getUrlKey} from '../../api/api'
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
      url: '',
      votePerson: '', // 参加过投票的人
      itemDetail: [],
      object: [],
      type: ['单选题', '多选题', '问答题', '打分题'],
      color: ['#33B5E5', '#0099CC', '#AA66CC', '#9933CC', '#99CC00', '#669900', '#FFBB33', '#FF8800', '#FF4444', '#CC0000'],
      colorNum: '',
      mouseWheel: true,
    }
  },
  created() {
    this.$nextTick(() => {
      this._initDetailList()
      this._initDom()
    })
  },
  methods: {
    _initDetailList() {
      // let voteId = getUrlId('id')
      let voteId = sessionStorage.getItem('countId')
      // console.log(voteId)
      let key = getUrlKey('s')
      this.url = url() + key
      let param = JSON.stringify({
        questionnaireid: voteId
      })
      let params1 = {
        serviceCode: 'SVCQY11011',
        data: param
      }
      let params2 = {
        serviceCode: 'SVCQY11014',
        data: param
      }
      let req1 = axios.post(this.url, params1)
      let req2 = axios.post(this.url, params2)
      /*
      *  req1: 查看投票接口
      *  req2: 查看投票结果
      * */
      axios.all([req1, req2]).then(
        axios.spread((acct, perms) => {
          this.itemDetail = acct.data.data //
          let showVote = perms.data.data
          this.votePerson = showVote
          // console.log(this.votePerson)
          this.object = showVote.questionList
        })
      )
    },
    _initDom() {
      let len = this.color.length
      this.colorNum = Math.floor(Math.random() * len)
    },
    formatData(time) {
      let date = new Date(parseInt(time) * 1000).toLocaleString()
      let newDate = date.replace(/年|月/g, '-').replace(/日/g, '').replace(/上|下|午/g, '')
      return newDate
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"
  .vote-detail
    position:absolute
    top: 0
    left:0
    width: 100%
    height: 100%
    background:#FFFFFF
    z-index: 2
    font-size:12px
    overflow:hidden
    .list-vote
      width: 100%
      height:100%
      .vote-detail-header
        padding:16px 0px
        border-bottom:1px solid #ccc
        .vote-header-width
          width: 90%
          margin:0 auto
        .paddingTop
          padding-top:10px
          .header-title
            font-size:16px
            font-weight:bold
        .flex
          display:flex
          justify-content:space-between
          color:#999
          font-size:12px
        .paddingTop
          font-size:12px
        .vote-detail-headerDec
          font-size:14px
          color:#666
      .vote-detail-content
        font-size:14px
        .vote-content-width
          margin:0 auto
          width:90%
          .li-item
            border-bottom:15px solid white
            .answer-bottom
              width: 100%
              margin:0 auto
              line-height:17px
              .text-area
                width:100%
                height:70px
                border:1px solid gainsboro
            .choice
              &::before
                content:'*'
                color:red
            .answer-bottom
              padding: 8px 0px
              .span-before
                display:inline-block
                width:100%
                margin:5px 0
                padding-right:4px
              .vm-progress
                width:100%
                .vm-progress-bar
                  width:70%
                  .vm-progress-bar__inner
                    color:#ed7a7a
                .vm-progress__text
                  .progress
                    color:#999
                    font-size:12px
            .title
              margin-top:10px
              font-size:14px
              .answer-type
                color:#999999
                margin-left:10px
            .end
              width: 100%
              margin:0 auto
            .none
              border-bottom:none
              color:#666
              padding:20px 0
            .vote-endDesc
              width: 100%
              border-bottom: 1px solid gainsboro
            .vote-Detfooter
              text-align:center
              width:100%
              border-bottom: 1px solid gainsboro
              .voteFlag
                padding:15px 0
                .vote-flag
                  width: 30%
                  margin:0 auto
                  font-size: 14px
                  color: #fff
                  background:#a7a8a6
                  border:none
                  padding:3px 25px
                  border-radius:5px
            .vote-person
              font-size:12px
              color:#666
              width:100%
              margin-top: 10px
              background:#F0FAFC
              // padding:10px 0
              .vote-icon,.vote-user
                margin:0 auto
                width: 90%
                padding:8px 5px
          .footer
            border-bottom: 15px solid #f0fafc
      .footer
        width: 100%
        &>div
          width:90%
          margin:0 auto
        .footer-desc
          width:100%
          border-bottom:1px solid #ccc
          padding:10px 0
          &>p
            width: 90%
            margin:0 auto
            color: #666
        .vote-status
          width:100%
          border-bottom:1px solid #ccc
          &>p
            width: 90%
            margin:0 auto
            text-align:center
            padding:10px 0
            &>.vote-flag
             border:none
             border-radius:5px
             padding:4px 20px
             font-size:14px
             color: #ffffff
             background:#a7a8a6
             width: 30%
        .vote-person
          width:100%
          background:#F0FAFC
          color: #666
          margin-top:20px
          .vote-icon,.vote-user
            width: 90%
            margin:0 auto
            padding:10px 0
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