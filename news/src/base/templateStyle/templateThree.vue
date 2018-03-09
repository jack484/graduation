<template>
  <scroll ref="scroll" class="template-three"
    :data="data"
    :pulldown="pulldown"
    @pulldown="getNowData"
    :pullup="pullup"
    @pullup="scrollToEnd">
    <div>
      <ul class="news-content-ul" v-if="data && data.length>0">
        <router-link :to="{path: '/newsDetail', query: {index: index, newsid: item.newsid}}" tag="li" class="news-content-li border-1px" v-for="(item,index) in data" :key="index">
          <div class="date-month" v-if="item.publishtime">
            <p class="month">{{_showTime(item.publishtime).substring(0, 2)}}月</p>
            <p class="date">{{_showTime(item.publishtime).substring(3, 5)}}</p>
          </div>
          <div class="content">
            <img class="cover-img" width="60" height="60" v-lazy="imgUrl + item.coverimageurl">
            <div class="desc">
              <h1 class="title">{{item.title}}</h1>
              <div class="other">
                <span class="text">{{item.categoryname}}</span>
                <span class="hot" v-if="item.topflag == true">置顶</span>
              </div>
            </div>
          </div>
        </router-link>
      </ul>
    </div>
  </scroll>
</template>
<script>
  import Scroll from 'base/scroll/scroll'
  import *as api from 'api/api'
  import http from 'api/http'
  import {formatDate} from 'common/js/date'

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
        newsList: [],
        pullup: true,
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    methods: {
      getNowData() {
        this.$emit('pulldown')
      },
      scrollToEnd() {
        this.$emit('scrollToEnd')
      },
      fetchData() {
        if (this.data) {
          let dataList = this.data
          dataList.forEach((item) => {
            let _date = this._showTime(item.publishtime)
            let _month =  _date.substring(0, 2)
            let _day = _date.substring(3, 5)
            this.newsList.push({
              author: item.author,
              categoryid: item.categoryid,
              categoryname: item.categoryname,
              content: item.content,
              coverdisplay: item.coverdisplay,
              coverimageurl: item.coverimageurl,
              newsid: item.newsid,
              summary: item.summary,
              publishtime: item.publishtime,
              summary: item.summary,
              title: item.title,
              topflag: item.topflag,
              _month: _month,
              _day: _day,
            })
          })
          // console.log(this.newsList)
        }
      },
      // 时间格式化过滤器
      _showTime(dateTime) {
        if (dateTime) {
          return formatDate(new Date(dateTime *1000), "MM月dd")
        } else {
          return ''
        }
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

  .template-three
    position: absolute
    top: 86px
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    background: #f2f5f7
    .news-content-ul
      width: 100%
      height: 100%
      .news-content-li
        display: flex
        margin: 0 18px 0
        padding: 10px 0
        // height: 60px
        overflow: hidden
        border-1px(rgba(7, 17, 27, .1))
        &:last-child
          border-none()
        .date-month
          flex: 0 0 40px
          width: 40px
          height: 40px
          margin-top: 5px
          margin-right: 10px
          text-align: center
          background: #4876ff
          border-radius: 50%
          .month
            margin-top: 3px
            line-height: 18px
            font-size: 12px
            color: #fff
          .date
            font-size: 18px
            color: #fff
            font-weight: bold
        .content
          flex: 1
          display: flex
          padding: 5px
          background: #fff
          border-radius: 5px
          box-shadow: 0px 5px 5px rgba(7, 17, 27, .1)
          .cover-img
            flex: 0 0 60px
            width: 60px
            padding: 5px 0
          .desc
            flex: 1
            margin-left: 5px
            position: relative
            .title
              padding: 5px 0
              line-height: 20px
              font-size: 14px
              font-weight: bold
              color: #333
              overflow: hidden
              display: -webkit-box // 多行文本溢出省略
              -webkit-box-orient: vertical
              -webkit-line-clamp: 2
            .other
              display: flex
              justify-content: space-between
              align-items: center
              position: absolute
              margin-left: 5px
              margin-top: 5px
              bottom: 0
              width: 95%
              .text
                font-size: 12px
                color: #666
              .hot
                flex: 0 0 30px
                width: 30px
                padding: 2px
                font-size: 12px
                border-radius: 3px
                background: #4876FF
                color: #fff
                text-align: center
</style>
