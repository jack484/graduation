<template>
  <scroll ref="scroll" class="reply-detail"
  :data="newsReplyList"
  :pulldown="pulldown"
  @pulldown="onConfirmReply"
  :pullup="pullup"
  :beforeScroll="beforeScroll"
  @scrollToEnd="loadMore"
  :mouseWheel="mouseWheel">
    <div class="reply-container">
      <div class="comment-box">
        <ul class="other-ul" v-if="newsReplyList.length > 0">
          <li class="other-li" v-for="(item, index) in newsReplyList">
            <div class="other-main">
            <div class="user-pic">
              <img class="pic" :src="item.avatar" v-if="item.avatar">
              <img v-else class="pic" src="../logo.jpg" alt="">
            </div>
            <div class="other-content">
              <div class="reply-user">
                <span class="title">{{item.replyusername}}</span>
                <span class="icon-del"
                v-if="item.replyuserid === currentUserId"
                @click="delComment(index, item.newsreplyid, item.newsid)"></span>
                <span v-else class="icon-comment" @click="commentOther(index, item.newsReplyId, item.newsid)"></span>
              </div>
              <div class="reply-time">
                <p class="time">{{item.replydate | dateTime}}</p>
                <p class="text" v-html="replace_em(item.replyContent)"></p>
              </div>
              <!-- 回复别人的评论 -->
              <ul class="other-reply">
                <li class="reply-list" v-for="(list, index) in item.replyresponselist">
                  <div class="reply-avatar">
                    <img :src="list.avatar" v-if="list.avatar">
                    <img v-else class="pic" src="../logo.jpg" alt="">
                  </div>
                  <div class="reply-content">
                    <h1 class="title">
                      <span class="reply-user-name">{{list.replyUserName}}</span>回复
                      <span class="reply-object">{{list.replyToObject}}</span>
                      <span class="icon-del"
                      v-if="list.replyUserId === currentUserId"
                      @click="closeComment(index, list.newsResponseId, list.newsId)"></span>
                      <span v-else class="icon-comment" @click="commentOther(index, list.newsResponseId, list.newsId)"></span>
                    </h1>
                    <p class="_time">{{list.replyDate | dateTime}}</p>
                    <p class="text" v-html="replace_em(list.replyContent)"></p>
                  </div>
                </li>
              </ul>
            </div>
            </div>
            <div class="linkage" @click="goNewsDetail(index, item.newsid)">
              <div class="link-cover">
                <img v-if="item.coverimageurl" class="cover" :src="imgUrl + item.coverimageurl">
                <img v-else class="cover" src="../logo.jpg">
              </div>
              <div class="link-content">
                <h1 class="title">{{item.title}}</h1>
                <span class="desc">{{item.categoryname}}</span>
              </div>
            </div>
          </li>
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
    </div>
    <commentList v-show="showCommentList"
      @hidComment="hidComment"
      @onConfirmReply="onConfirmReply"></commentList>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import commentList from 'base/commentList/commentList'
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
        imgUrl: api.imgUrl, // 初始化图片路径
        pulldown: false, // 下拉刷新
        pageNum: 1,
        pageSize: 20,
        newsReplyList: [],
        currentUserId: null,
        showCommentList: false,
        newsId: null,
        pullup: true, // 上拉加载
        beforeScroll: true,
        hasMore: false,
        noMore: false,
        mouseWheel: true,
      }
    },
    computed: {
      ...mapGetters([
        'getSessionKey',
      ])
    },
    mounted() {
      this.getData()
    },
    methods: {
      ...mapActions([
        'saveNewsResponseId', 'saveNewsId'
      ]),
      async getData() {
        this.hasMore = true
        this.noMore = false
        let params = {
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
          "sessionKey": this.getSessionKey,
        }
        let url = api.serviceUrl + this.getSessionKey
        const replyMeDatas = await http.post(url,api.serviceReplyMe, params)
        if (replyMeDatas.data.code === api.ERR_OK) {
          let response = replyMeDatas.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          this.currentUserId = response.currentUserId
          this.newsReplyList = response.newsReplyList.list
          this._checkMore(response.newsReplyList)
        } else {
          Toast({
            duration: 1000,
            message: replyMeDatas.data.msg
          })
        }
      },
      async loadMore() {
        if (!this.hasMore) {
          return
        }
        if (this.newsReplyList.length>0) {
          if (this.pageNum++ < this.maxPage) {
            let params = {
              "pageNum": this.pageNum,
              "pageSize": this.pageSize,
              "sessionKey": this.getSessionKey,
            }
            let url = api.serviceUrl + this.getSessionKey
            const replyMeDatas = await http.post(url,api.serviceReplyMe, params)
            if (replyMeDatas.data.code === api.ERR_OK) {
              let response = replyMeDatas.data.data
              response = response && response === '[]' ? [] :JSON.parse(response)
              this.currentUserId = response.currentUserId
              this.newsReplyList = response.newsReplyList.list
              this._checkMore(response.newsReplyList)
            } else {
              Toast({
                duration: 1000,
                message: replyMeDatas.data.msg
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
        }
      },
      _checkMore(data) {
        if (!data.list.length || (data.pageNo * this.pageSize) > data.totalCount) {
          this.hasMore = false
          this.noMore = true
        }
      },
      // 替换qq表情路径地址
      replace_em(str){
        str = str.replace(/\</g,'&lt;')
        str = str.replace(/\>/g,'&gt;')
        str = str.replace(/\n/g,'<br/>')
        str = str.replace(/\[em_([0-9]*)\]/g,'<img src="static/image/faceQQ/$1.gif"/>')
        return str
      },
      // 回复别人的评论
      commentOther(index, id, newsId) {
        this.saveNewsResponseId(id)
        this.saveNewsId(newsId)
        this.showCommentList = !this.showCommentList
      },
      // 删除一级评论
      async delComment(index, id, newsid) {
        this.newsReplyList = this.newsReplyList.filter((item) => item.newsReplyId !== id)
        let params = {
          "newsId": newsid,
          "newsReplyId": id,
          "sessionKey": this.getSessionKey,
        }
        let url = api.serviceUrl + this.getSessionKey
        const delCommentDatas = await http.post(url, api.serviceDelReply, params)
        if (delCommentDatas.data.code === api.ERR_OK) {
          Toast({
            duration: 1000,
            message: '评论删除成功'
          })
        } else {
          Toast({
            duration: 1000,
            message: '删除失败'
          })
        }
      },
      // 删除二级评论
      async closeComment(index, id, newsId) {
        this.newsReplyList.forEach((list) => {
          if (list.replyresponselist.length > 0) {
            list.replyresponselist.splice(index, 1)
          }
        })
        let params = {
          "newsId": newsId,
          "newsReplyId": id,
          "sessionKey": this.getSessionKey,
        }
        let url = api.serviceUrl + this.getSessionKey
        const closeCommentDatas = await http.post(url, api.serviceDelReply, params)
        if (closeCommentDatas.data.code === api.ERR_OK) {
          Toast({
            duration: 1000,
            message: '评论删除成功'
          })
        } else {
          Toast({
            duration: 1000,
            message: '删除失败'
          })
        }
      },
      hidComment() {
        this.showCommentList = false
      },
      onConfirmReply() {
        this.getData()
        this.showCommentList = false
      },
      goNewsDetail(index, id) {
        this.$router.push({path: '/newsDetail', query: {index: index, newsid: id}})
      }
    },
    components: {
      Scroll,
      commentList,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .reply-detail
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    background: #f2f5f7
    z-index: 101
    .comment-box
      .other-ul
        padding: 10px 18px
        padding-bottom: 20px
        background: #fff
        .other-li
          width: 100%
          padding: 10px 0
          .other-main
            display: flex
            .user-pic
              flex: 0 0 40px
              width: 40px
              margin-right: 8px
              .pic
                width: 100%
                border-radius: 50%
            .other-content
              flex: 1
              .reply-user
                display: flex
                // margin-top: 5px
                justify-content: space-between
                align-items: center
                font-size: $font-size-medium
                line-height: 20px
                .icon-del, .icon-comment
                  font-size: 16px
                  color: $color-dialog-background-x
              .reply-time
                line-height: 20px
                .time
                  font-size: $font-size-small
                  color: $color-dialog-background-x
                .text
                  font-size: $font-size-medium
              .other-reply
                margin: 10px 0
                .reply-list
                  display: flex
                  padding: 10px 0
                  .reply-avatar
                    flex: 0 0 40px
                    width: 40px
                    margin-right: 8px
                    &>img
                      width: 100%
                      border-radius: 50%
                  .reply-content
                    flex: 1
                    .title
                      display: flex
                      line-height: 20px
                      font-size: 14px
                      color: #999
                      .reply-user-name
                        margin-right: 5px
                        color: #666
                      .icon-del, .icon-comment
                        flex: 0 0 20px
                        width: 20px
                        text-align: right
                        font-size: 16px
                      .reply-object
                        flex: 1
                        margin-left: 5px
                        color: #666
                    ._time
                      margin: 5px 0
                      font-size: $font-size-small
                      color: $color-dialog-background-x
                    .text
                      line-height: 16px
                      font-size: $font-size-medium
          .linkage
            display: flex
            padding: 8px 10px
            background: rgba(7, 17, 27, .05)
            .link-cover
              flex: 0 0 50px
              width: 50px
              margin-right: 10px
              margin-top: 5px
              .cover
                width: 100%
            .link-content
              flex: 1
              .title
                font-size: 14px
                line-height: 20px
                overflow: hidden
                display: -webkit-box // 多行文本溢出省略
                -webkit-box-orient: vertical
                -webkit-line-clamp: 2
              .desc
                line-height: 14px
                font-size: 12px
                color: #666
                display: -webkit-box // 多行文本溢出省略
                -webkit-box-orient: vertical
                -webkit-line-clamp: 1
      .empty
        position: absolute
        top: 50%
        left: 50%
        text-align: center
        transform: translate(-50%, 170%)
        .empty-img
          &>img
            border-radius: 50%
        .text
          width: 100%
          color: $color-dialog-background-x
          font-size: $font-size-small
</style>
