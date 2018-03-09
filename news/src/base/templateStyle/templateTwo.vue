<template>
  <scroll ref="scroll" class="template-two"
    :data="data"
    :pulldown="pulldown"
    @pulldown="getNowData">
    <div>
      <ul class="news-content-ul" v-if="data && data.length>0">
        <router-link :to="{path: '/newsDetail', query: {index: index, newsid: item.newsid}}" tag="li" class="news-content-li border-1px" v-for="(item,index) in data" :key="index">
          <div class="date-month" v-if="item.publishtime != null">
            <p class="month">{{_showTime(item.publishtime).substring(0, 2)}}月</p>
            <p class="date">{{_showTime(item.publishtime).substring(3, 5)}}</p>
          </div>
          <div class="content">
            <h1 class="title">{{item.title}} | {{item.categoryname}}</h1>
            <div class="other">
              <span class="summary">{{item.summary}}</span>
              <span class="hot" v-if="item.topflag == true">置顶</span>
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
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      getNowData() {
        this.$emit('pulldown')
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

  .template-two
    position: absolute
    top: 86px
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    .news-content-ul
      width: 100%
      height: 100%
      background: #fff
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
          flex: 0 0 50px
          width: 50px
          height: 100%
          tex-align: center
          .month
            margin-top: 13px
            line-height: 20px
            font-size: 14px
            color: #999
          .date
            font-size: 30px
            color: #4876FF
            font-weight: bold
        .content
          flex: 1
          .title
            padding: 10px 0
            line-height: 20px
            font-size: 14px
            font-weight: bold
            color: #333
          .other
            display: flex
            width: 100%
            .summary
              flex: 1
              line-height: 18px
              font-size: 14px
              color: #666
              display: -webkit-box
              -webkit-box-orient: vertical
              -webkit-line-clamp: 1
              overflow: hidden
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
