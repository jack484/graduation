<template>
  <scroll ref="scroll" :data="finishExamList" :mouseWheel="mouseWheel" :pullup="pullup" @scrollToEnd="loadMore" class="finish-exam">
    <div class="container">
      <ul class="list-ul" v-if="finishExamList.length>0">
        <li class="list border-1px" v-for="(item, index) in finishExamList" @click="goAnswerItem(item.id)">
          <h1 class="title">{{item.title}}</h1>
          <div class="other">
            <span class="time">{{item.validdateto | dateTime}} 截止</span>
            <span class="respondents">{{item.respondents}} 人参与</span>
          </div>
        </li>
        <loading v-show="hasMore" title=""></loading>
      </ul>
      <div v-else class="empty">暂无数据</div>
    </div>
    <transition name="router-slid" mode="out-in">
      <router-view/>
    </transition>
  </scroll>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import { Toast } from 'vant'
  import *as api from 'api/api'
  import http from 'api/http'
  import {formatDate} from 'common/js/date'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'

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
        pageNum: 1, // 页数
        pageSize: 20, // 每页显示的条数
        maxPage: null, // 总页数
        finishExamList: [],
        pullup: true,
        hasMore: false,
        mouseWheel: true,
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
      async getData() {
        this.hasMore = true
        let params = {
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
          "status": 2,
        }
        let url = api.serviceUrl + this.getSessionKey
        const examData = await http.post(url, api.servicEexam, params)
        if (examData.data.code === api.ERR_OK) {
          this.finishExamList = examData.data.data.data
          // console.log(this.finishExamList)
          this._checkMore(examData.data.data)
        } else {
          Toast({
            duration: 1000,
            message: examData.data.msg
          })
        }
      },
      async loadMore() {
        if (!this.hasMore) {
          return
        }
        if (this.pageNum++ < this.maxPage) {
          let params = {
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
          "status": 1,
        }
        let url = api.serviceUrl + this.getSessionKey
        const examData = await http.post(url, api.servicEexam, params)
        if (examData.data.code === api.ERR_OK) {
          this.finishExamList = this.finishExamList.concat(examData.data.data.data)
          this._checkMore(this.finishExamList)
        } else {
          Toast({
            duration: 1000,
            message: unExamData.data.msg
          })
        }
        } else {
          Toast({
            duration: 1000,
            message: '没有更多数据了'
          })
          // return
          // this.pageNum--
        }
      },
      _checkMore(data) {
        if (!data.length || (this.pageNum * this.pageSize) > data.recordsFiltered) {
          this.hasMore = false
          this.noMore = true
        }
      },
      goAnswerItem(id){
        this.$router.push({path: '/answerItem', query: {paperid: id}})
      }
    },
    components: {
      Scroll,
      Loading,
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .finish-exam
    position: absolute
    top: 50px
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    .container
      .list-ul
        background: #fff
        padding: 10px 18px
        .list
          width: 100%
          padding: 5px 0
          border-1px(rgba(7, 17, 27, .1))
          &:last-child
            border-none()
          .title
            line-height: 24px
            font-size: $font-size-medium
            font-weight: bold
          .other
            display: flex
            width: 100%
            justify-content: space-between
            align-items: center
            .time, .respondents
              margin-top: 5px
              line-height: 16px
              font-size: $font-size-small
              color: $color-dialog-background-x
      .empty
        font-size: $font-size-small
        text-align: center
        margin-top: 80px
        color: $color-dialog-background-x
</style>
