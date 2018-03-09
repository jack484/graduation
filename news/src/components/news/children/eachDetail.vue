<template>
  <scroll ref="scroll" class="each-detail"
    :data="newsList"
    :pulldown="pulldown"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollToEnd="loadMore"
    :mouseWheel="mouseWheel"
    >
    <div>
      <ul class="news-content-ul" v-if="newsList && newsList.length>0">
        <router-link :to="{path: '/newsDetail', query: {index: index, newsid: item.newsid}}" tag="li" class="news-content-li" v-for="(item,index) in newsList" :key="index">
          <div class="news-img">
            <img width="70" height="70" v-lazy="imgUrl + item.coverimageurl" v-if="item.coverimageurl || item.coverimageurl != null">
            <img class="new-img" v-else src="../logo.jpg">
          </div>
          <div class="news-text border-1px">
            <div class="news-title">
              <span class="title">{{item.title}} | {{item.categoryname}}</span>
            </div>
            <div class="time">
              <span >{{item.publishtime | showTime}}</span>
              <span class="hot" v-if="item.topflag == true">置顶</span>
            </div>
          </div>
        </router-link>
        <loading v-show="hasMore" title=""></loading>
        <div class="empty-alert" v-show="noMore">已全部加载完</div>
      </ul>
      <div v-else class="empty">
        <div class="empty-img">
          <img src="../empty.jpg" width="140" height="105">
        </div>
        <span class="text">暂无相关数据</span>
      </div>
    </div>
  </scroll>
</template>
<script>
  import Scroll from 'base/scroll/scroll'
  import *as api from 'api/api'
  import http from 'api/http'
  import {formatDate} from 'common/js/date'
  import {mapGetters, mapActions} from 'vuex'
  import { Toast } from 'vant'
  import Loading from 'base/loading/loading'

  export default {
    filters: {
      // 时间格式化过滤器
      showTime(dateTime) {
        if (dateTime) {
          return formatDate(new Date(dateTime *1000), "yyyy-MM-dd")
        } else {
          return ''
        }
      },
    },
    data() {
      return {
        imgUrl: api.imgUrl, // 初始化图片路径
        pulldown: true,
        pageNum: 1,
        pageSize: 20,
        service: null, // 接受从首页传过来的service
        newsList: [],
        beforeScroll: true,
        pullup: true, // 上拉加载更多
        hasMore: false,
        noMore: false,
        maxPage: null,
        mouseWheel: true,
      }
    },
    created() {
      this.service = this.$route.query.service
    },
    computed: {
      ...mapGetters([
        'getNewsList', 'getSessionKey'
      ])
    },
    mounted() {
      this.getData()
    },
    methods: {
      async getData() {
        this.hasMore = true
        this.noMore = false
        let params = {
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
          "sessionKey": this.getSessionKey,
        }
        let url = api.serviceUrl + this.getSessionKey
        const commentData = await http.post(url, this.service, params)
        if (commentData.data.code === api.ERR_OK) {
          let response = commentData.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          this.newsList = response.newsList.list
          this.maxPage = response.newsList.maxPage
          this._checkMore(response.newsList)
        } else {
          Toast({
            duration: 1000,
            message: commentData.data.msg
          })
        }
      },
      async loadMore() {
        if (!this.hasMore) {
          return
        }
        if (this.newsList.length>0) {
          if (this.pageNum++ < this.maxPage) {
            let params = {
              "pageNum": this.pageNum,
              "pageSize": this.pageSize,
              "sessionKey": this.getSessionKey,
            }
            let url = api.serviceUrl + this.getSessionKey
            const commentData = await http.post(url, this.service, params)
            if (commentData.data.code === api.ERR_OK) {
              let response = commentData.data.data
              response = response && response === '[]' ? [] :JSON.parse(response)
              this.newsList = this.newsContentList.concat(response.newsList.list)
              this._checkMore(response.newsList)
            } else {
              Toast({
                duration: 1000,
                message: commentData.data.msg
              })
            }
          } else {
            Toast({
              duration: 1000,
              message: '没有更多数据了'
            })
            // this.pageNum--
          }
        }
      },
      _checkMore(data) {
        if (!data.list.length || (data.pageNo * this.pageSize) > data.totalCount) {
          this.hasMore = false
          this.noMore = true
        }
      },
    },
    components: {
      Scroll,
      Loading,
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .each-detail
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    background: #f2f5f7
    z-index: 101
    .news-content-ul
      background: #fff
      padding-bottom: 10px
      .news-content-li
        display: flex
        // width: 100%
        padding: 10px 18px
        .news-img
          flex: 0 0 70px
          width: 70px
          margin-right: 10px
          img
            width: 100%
            min-height: 65px
        .news-text
          flex: 1
          border-1px(rgba(7, 17, 27, .1))
          .news-title
            margin-top: 5px
            line-height: 24px
            font-size: $font-size-medium
            color: #333
            .title
              margin-right: 5px
              width: 100%
              line-height: 20px
              overflow: hidden
              display: -webkit-box // 多行文本溢出省略
              -webkit-box-orient: vertical
              -webkit-line-clamp: 2
            .category-name
              margin-left: 5px
          .time
            display: flex
            justify-content: space-between
            width: 100%
            position: absolute
            bottom: 5px
            font-size: $font-size-small
            color: $color-dialog-background-x
            .hot
              padding: 2px
              margin-right: 5px
              border-radius: 3px
              background: #1E90FF
              color: #fff
      .empty-alert
        text-align: center
        line-height: 30px
        font-size: $font-size-small
        color: $color-dialog-background-x
    .empty
      position: absolute
      top: 50%
      // bottom: 0
      left: 50%
      // right: 0
      // line-height: 100px
      text-align: center
      transform: translate(-50%, 170%)
      // overflow: hidden
      .empty-img
        &>img
          border-radius: 50%
      .text
        width: 100%
        color: $color-dialog-background-x
        font-size: $font-size-small
</style>
