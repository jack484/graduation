<template>
  <scroll ref="scroll" class="template-one"
    :data="data"
    :pulldown="pulldown"
    @pulldown="getNowData">
    <div>
      <ul class="news-content-ul" v-if="data && data.length>0">
        <router-link :to="{path: '/newsDetail', query: {index: index, newsid: item.newsid}}" tag="li" class="news-content-li border-1px" v-for="(item,index) in data" :key="index">
          <h1 class="title">{{item.title}} | {{item.categoryname}}</h1>
          <p class="summary">{{item.summary}}</p>
          <div class="other">
            <span >{{item.publishtime | showTime}}</span>
            <span class="hot" v-if="item.topflag == true">置顶</span>
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
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    mounted() {
    },
    methods: {
      getNowData() {
        this.$emit('pulldown')
        // console.log(11111)
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

  .template-one
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
        margin: 0 18px 0
        padding: 10px 0
        border-1px(rgba(7, 17, 27, .1))
        &:last-child
          border-none()
        .title
          padding: 10px 0
          line-height: 20px
          font-size: 14px
          font-weight: bold
          color: #333
        .summary
          width: 100%
          line-height: 18px
          font-size: 14px
          color: #666
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
        .other
          display: flex
          justify-content: space-between
          align-items: center
          margin-top: 5px
          font-size: 12px
          line-height: 14px
          color: #999
          .hot
            padding: 2px
            margin-right: 5px
            border-radius: 3px
            background: #4876FF
            color: #fff
</style>
