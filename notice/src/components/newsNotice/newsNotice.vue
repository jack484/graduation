<template>
  <div class="news-detail">
    <!-- <scroll ref="newsDetail" class="detail-wrapp"
    :data="scrollList"
    :mouseWheel="mouseWheel"> -->
    <div ref="newsDetail" class="detail-wrapp">
      <div>
      <div v-if="newsList">
        <!-- 标题、副标题区 -->
        <div class="detail-head" v-if="newsList.title">
          <div class="news-title">
            <span class="title">{{newsList.title}}</span>
          </div>
          <div class="head-other">
            <div class="time-desc">
              <span class="time">{{newsList.publishTime | showTime}}</span>
              <span class="text">{{newsList.author}}</span>
            </div>
            <div class="read">
              <span class="icon-show_password"></span>
              <span class="text">{{newsReadList.length}}</span>
            </div>
          </div>
        </div>
        <!-- 内容区 -->
        <div class="detail-content">
          <div class="content" v-html="v_html"></div>
        </div>
        <!-- 已读人员显示区 -->
        <div class="show-read">
          <div class="read-list">
            <div class="title">
              <span class="user">已读人员({{newsReadList.length}})</span>
              <div class="show-list" @click="showMore" v-if="newsReadList.length > 15">
                <span class="text">{{showHid}}</span>
                <span class="icon" id="iconDown"><i class="icon-down"></i></span>
              </div>
            </div>
            <ul class="read-ul" id="readUl" v-if="newsReadList.length < 50">
              <li class="name-list" v-for="(item, index) in newsReadList">
                <span class="text">{{item.readUserName}},</span>
              </li>
            </ul>
            <ul class="read-ul" id="readUl" v-else>
              <li class="name-list" v-for="(item, index) in currentReadList">
                <span class="text">{{item.readUserName}},</span>
              </li>
              <span>...</span>
            </ul>
          </div>
        </div>
        <!-- 评论、点赞区 -->
        <div class="reply-container">
          <div ref="replyHead" class="reply-head border-1px">
            <div class="reply" @click="switchClick('reply')" :class="{'active': isActive == 'reply'}">
              <span class="text">评论({{newsReplyList.length}})</span>
            </div>
            <div class="praise" @click="switchClick('praise')" :class="{'active': isActive == 'praise'}">
              <span class="text">赞({{newsPraiseList.length}})</span>
            </div>
          </div>
          <!-- 评论 -->
          <div v-if="isShowSwitch">
            <ul class="other-ul" v-if="newsReplyList.length > 0">
              <li class="other-li" v-for="(item, index) in newsReplyList">
                <div class="user-pic">
                  <img class="pic" :src="item.avatar" v-if="item.avatar != null && item.avatar">
                  <img v-else class="pic" src="./logo.jpg" alt="">
                </div>
                <div class="other-content">
                  <div class="reply-user">
                    <span class="title">{{item.replyUserName}}</span>
                    <span class="icon-del"
                    v-if="item.replyUserId === currentUserId"
                    @click="delComment(index, item.newsReplyId)"></span>
                    <span v-else class="icon-comment" @click="commentOther(index, item.newsReplyId)"></span>
                  </div>
                  <div class="reply-time">
                    <p class="time">{{item.replyDate | dateTime}}</p>
                    <!-- <p class="text">{{item.replyContent}}</p> -->
                    <p class="text" v-html="replace_em(item.replyContent)"></p>
                  </div>
                  <!-- 回复别人的评论 -->
                  <ul class="other-reply" :class="{'show-height': isShowHeight}" v-if="item.replyResponseList.length>0">
                    <li class="reply-list" v-for="(list, index) in item.replyResponseList">
                      <div class="reply-avatar">
                        <img :src="list.avatar" v-if="list.avatar != null && list.avatar">
                        <img v-else class="pic" src="./logo.jpg" alt="">
                      </div>
                      <div class="reply-content">
                        <h1 class="title">
                          <span class="reply-user-name">{{list.replyUserName}}</span>回复
                          <span class="reply-object">{{list.replyToObject}}</span>
                          <span class="icon-del"
                          v-if="list.replyUserId === currentUserId"
                          @click="closeComment(index, list.newsResponseId)"></span>
                          <span v-else class="icon-comment" @click="commentOther(index, list.newsResponseId)"></span>
                        </h1>
                        <p class="_time">{{list.replyDate | dateTime}}</p>
                        <!-- <p class="text">{{list.replyContent}}</p> -->
                        <p class="text" v-html="replace_em(list.replyContent)"></p>
                      </div>
                    </li>
                  </ul>
                  <div class="show-more" v-if="item.replyResponseList.length > 2">
                    <span class="more" @click="onShowMoreReply" v-if="isMoreButton">查看更多回复</span>
                    <span class="more" @click="hidMoreReply" v-else>收起回复</span>
                  </div>
                </div>
              </li>
            </ul>
            <div v-else class="empty-reply">
              <span class="text">暂无评论，我来发表第一篇评论！</span>
            </div>
          </div>
          <!-- 点赞 -->
          <div v-else>
            <ul class="praise-ul" v-if="newsPraiseList.length > 0">
              <li class="praise-li border-1px" v-for="praise in newsPraiseList">
                <div class="user-pic">
                  <img class="pic" :src="praise.praiseUser.avatar" v-if="praise.praiseUser != null && praise.praiseUser.avatar">
                  <img v-else class="pic" src="./logo.jpg" alt="">
                </div>
                <div class="praise-content">
                  <h1 class="user">{{praise.praiseUserName}}</h1>
                  <span class="time">{{praise.praiseDate | dateTime}}</span>
                </div>
              </li>
            </ul>
            <div v-else class="empty-praise">
              <span class="text">喜欢就留个赞吧！</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty">
        <div class="empty-img">
          <img src="./empty.jpg" width="140" height="105">
        </div>
        <span class="text">暂无相关数据</span>
      </div>
      </div>
    <!-- </scroll> -->
    </div>
    <div class="loading-container" v-show="isShowLoading">
      <loading title=''></loading>
    </div>
    <replyPraise :newsId="currentNewsId"
    :newsReplyList="newsReplyList"
    @onWriteComment="onWriteComment"
    @confirmPraise="confirmPraise"
    @confirmFavorit="confirmFavorit"
    @goReplyWrapp="goReplyWrapp"></replyPraise>
    <commentList v-show="showCommentList"
    :newsId="currentNewsId"
    @hidComment="hidComment"
    @onConfirm="onConfirm"
    @onConfirmReply="onConfirmReply"></commentList>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import replyPraise from 'base/replyPraise/replyPraise'
  import commentList from 'base/commentList/commentList'
  import Loading from 'base/loading/loading'
  import *as api from 'api/api'
  import http from 'api/http'
  import {formatDate} from 'common/js/date'
  import { Toast } from 'vant'
  import {getUrlKey} from 'common/js/getSessionKey'
  import {mapGetters, mapActions} from 'vuex'
  import BScroll from 'better-scroll'

  export default {
    filters: {
      // 时间格式化过滤器
      showTime(p_inputTimeStamp) {
        if (p_inputTimeStamp) {
          return formatDate(new Date(p_inputTimeStamp *1000), "yyyy-MM-dd")
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
        content: null,
        title: null,
        categoryname: null,
        newsId: null,
        time: null,
        v_html: '',
        msg: true,
        isActive: 'reply',
        isShowSwitch: true,
        newsList: [],
        newsReadList: [], // 阅读用户数据
        newsPraiseList: [], // 点赞用户数据
        newsReplyList: [], // 评论用户数据
        v_index: null,
        barList: [], // 评论输入框提示小红点
        showCommentList: false, // 是否显示评论输入框
        praiseFlag: '', // 点赞状态 Y为已赞， N为未赞
        collectFlag: '', // 收藏状态 Y为已收藏， N为未收藏
        currentUserId: null, // 当前用户ID
        isShowHeight: false, // 显示更多评论回复
        isShowMoreReply: false, // 是否显示更多评论
        isMoreButton: true, // 收起更多评论回复
        isShowLoading: true, // 加载等待项
        videoArr: [],
        currentSessionKey: null,
        currentNewsId: '',
        currentReadList: [],
        scrollList: [],
        mouseWheel: true,
      }
    },
    created() {
      this.currentNewsId = getUrlKey('newsId')
      this.currentSessionKey = getUrlKey('s')
      if (this.currentSessionKey != null) {
        this.saveSessionKey(this.currentSessionKey)
      }
    },
    computed: {
      showHid() {
        return this.msg ? '展开' : '收起'
      },
    },
    mounted() {
      this.getData()
      let self = this
      window.onload = function(){
        // self.initScroll()
      }
    },
    methods: {
      ...mapActions([
        'savePraise', 'saveCollectFlag', 'saveNewsResponseId', 'saveSessionKey'
      ]),
      async getData() {
        let params = {
          "newsId": this.currentNewsId,
          "sessionKey": this.currentSessionKey,
        }
        let url = api.serviceUrl + this.currentSessionKey
        const newsData = await http.post(url, api.serviceNewsNotice, params)
        if (newsData.data.code === api.ERR_OK) {
          let response = newsData.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          this.isShowLoading = false
          this.newsList = response.newsData
          // TODO
          this.scrollList.push(this.newsList)
          this.praiseFlag = response.praiseFlag
          this.collectFlag = response.collectFlag
          this.currentUserId = response.currentUserId
          this.newsReadList = response.readList
          this.newsPraiseList = response.praiseList
          this.newsReplyList = response.replyList

          this.savePraise(this.praiseFlag)
          this.saveCollectFlag(this.collectFlag)
          if (this.newsReadList.length > 50) {
            this.currentReadList = this.newsReadList.slice(0, 50)
          }
          this.newsReplyList.forEach((list) => {
            if (list.replyResponseList.length > 2) {
              this.isShowHeight = true
            }
          })
          let vidReg = /vid=([\'\"]?([^\'\"]*))/g
          let vid = ''
          if (this.newsList.content.match(vidReg)) {
             vid = vidReg.exec(this.newsList.content)[1]
          }
          let str = this.newsList.content
          if (vid != '') {
            str = this.newsList.content.replace(/<embed.*?(?:>|\/>)/g, '<div id="testId" width="320" height="240"></div>')
          }
          this.v_html = str.replace(/\/quany/g, api.imgUrl)

          // 如果有音频时 添加touchstart 事件
          this.$nextTick(() => {
             if (this.v_html) {
              let _music = document.getElementsByClassName('music-css')
              let video = document.getElementsByTagName('video')
              for (let i = 0; i < video.length; i++) {
                video[i].style.border = '1px solid rgba(7, 17, 27, .1)'
                video[i].style.borderRadius = '10px'
                video[i].style.marginTop = '10px'
                video[i].style.marginBottom = '10px'
                video[i].style.width = '100%'
              }

              for(let i = 0; i < _music.length; i++) {
                _music[i].style.zIndex = '10'
                _music[i].style.position = 'relative'
                let audio = _music[i].getElementsByTagName("audio")[0]
                let _img = _music[i].getElementsByClassName('music-img-css')[0]
                _img.style.position = 'absolute'
                _img.style.borderRadius = '50%'
                _music[i].addEventListener("click", function() {
                  if (audio.paused) {
                      audio.play()
                      _img.setAttribute("class","music-img-css music_play")
                  } else {
                      audio.pause()
                      _img.setAttribute("class","music-img-css")
                  };
                }, false)
              }
            }
          })

          this.$nextTick(() => {
            let innerId = document.getElementById('testId')
            if (innerId != null) {
              this.showVideo(vid)
            }
            // this.initScroll()
          })
        } else {
          Toast({
            duration: 3000,
            message: newsData.data.msg
          })
          this.isShowLoading = false
        }
      },
      // 点击展开按钮时，显示更多已读人员
      showMore() {
        this.msg = !this.msg
        let inner = document.getElementById('iconDown')
        let readUl = document.getElementById('readUl')
        if (this.msg === true) {
          inner.style.transform = 'rotate(0deg)'
          readUl.style.height = '50px'
        } else {
          inner.style.transform = 'rotate(180deg)'
          readUl.style.height = '100%'
          readUl.style.minHeight = '50px'
        }
      },
      // 替换qq表情路径地址
      replace_em(str){
        str = str.replace(/\</g,'&lt;')
        str = str.replace(/\>/g,'&gt;')
        str = str.replace(/\n/g,'<br/>')
        str = str.replace(/\[em_([0-9]*)\]/g,'<img src="static/images/faceQQ/$1.gif"/>')
        return str
      },
      switchClick(s) {
        this.isActive = s
        this.isShowSwitch = !this.isShowSwitch
      },
      // 腾讯视频统一播放器转换
      showVideo(_setVid) {
        let video = new tvp.VideoInfo()
        video.setVid(_setVid)
        let player = new tvp.Player()
        player.create({
          width: 320,       //播放器的宽度
          height: 240,     //播放器的高度
          video: video,       //默认的视频对象
          modId: 'testId',       //默认的 DOM 元素 ID
          autoplay: false,
          // pic: imgURL
        });
        player.onplaying = function (vid){
        }
        player.onallended = function (vid){
        }
      },
      initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.newsDetail, {
            click: true,
            mouseWheel: true,
          })
        } else {
          this.scroll.refresh()
        }
      },
      // 唤出评论窗口
      onWriteComment() {
        this.showCommentList = true
      },
      hidComment() {
        this.showCommentList = false
      },
      onConfirm() {
        this.getData()
        this.showCommentList = false
      },
      // // 点赞
      confirmPraise() {
        this.getData()
      },
      // 收藏
      confirmFavorit() {
        this.getData()
      },
      // 删除一级评论
      async delComment(index, id) {
        this.newsReplyList = this.newsReplyList.filter((item) => item.newsReplyId !== id)
        let params = {
          "newsId": this.newsId,
          "newsReplyId": id,
          "sessionKey": this.currentSessionKey,
        }
        let url = api.serviceUrl + this.currentSessionKey
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
      async closeComment(index, id) {
        this.newsReplyList.forEach((list) => {
          if (list.replyResponseList.length > 0) {
            list.replyResponseList.splice(index, 1)
          }
        })

        let params = {
          "newsId": this.newsId,
          "newsReplyId": id,
          "sessionKey": this.currentSessionKey,
        }
        let url = api.serviceUrl + this.currentSessionKey
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
      // 回复别人的评论
      commentOther(index, id) {
        this.saveNewsResponseId(id)
        this.showCommentList = !this.showCommentList
      },
      onConfirmReply() {
        this.getData()
        this.showCommentList = false
      },
      onShowMoreReply() {
        this.isShowHeight = false
        this.isMoreButton = false
      },
      hidMoreReply() {
        this.isShowHeight = true
        this.isMoreButton = true
      },
      // 点击滚动到评论处
      goReplyWrapp() {
        this.$refs.replyHead.scrollIntoView(false)
        // this.scroll.scrollToElement(this.$refs.replyHead, 1000)
      }
    },
    watch: {
      'newsDetail'() {
        this.$nextTick(() => {
          this.initScroll()
        })
      }
    },
    components: {
      Scroll,
      replyPraise,
      commentList,
      Loading,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .news-detail
    position: absolute
    // bottom: 0
    top: 0
    left: 0
    right: 0
    // overflow: hidden
    background: #fff
    .detail-wrapp
      position: absolute
      // bottom: 40px
      top: 0
      left: 0
      right: 0
      // overflow: hidden
      margin-bottom: 40px
      background: #fff
      // z-index: 101
      .detail-head
        padding: 10px 18px
        .news-title
          margin-bottom: 10px
          line-height: 24px
          text-align: center
          font-size: $font-size-large
          color: $color-dialog-background
          font-weight: bold
          .title
            margin-right: 5px
          .category-name
            margin-left: 5px
        .head-other
          display: flex
          justify-content: space-between
          align-items: center
          padding: 10px 0
          color: $color-dialog-background-x
          .time-desc
            font-size: $font-size-medium
            .time
              margin-right: 5px
          .read
            font-size: $font-size-medium
            .icon-show_password
              font-size: $font-size-medium-x
      .detail-content
        margin: 10px 18px
        .content
          width: 100%
          img
            width: 100%
      .show-read
        margin: 10px 18px
        padding-top: 35px
        .read-list
          width: 100%
          .title
            display: flex
            justify-content: space-between
            align-items: center
            margin-bottom: 10px
            .user
              line-height: 18px
              font-size: $font-size-medium
              color: $color-dialog-background
            .show-list
              display: flex
              line-height: 18px
              color: #4876FF
              .text
                font-size: $font-size-medium
              .icon-show_password
                font-size: $font-size-medium-x
          .read-ul
            display: flex
            flex-wrap: wrap
            width: 100%
            height: 50px
            overflow: hidden
            .name-list
              margin-right: 10px
              margin-bottom: 5px
              .text
                line-height: 20px
                font-size: $font-size-small
                color: $color-dialog-background-x
      .next-chapter
        display: flex
        margin: 10px 18px
        padding-top: 20px
        color: $color-dialog-background
        .next
          flex: 0 0 60px
          width: 60px
          font-size: $font-size-medium
        .title
          // flex: 1
          padding-bottom: 2px
          border-1px(rgba(7, 17, 27, .5))
          .text, .category-name
            font-size: $font-size-medium
      .reply-container
        margin: 10px 18px
        .reply-head
          display: flex
          width: 100%
          border-1px(rgba(7, 17, 27, .1))
          .reply, .praise
            margin-right: 18px
            line-height: 35px
            .text
              font-size: $font-size-medium-x
              color: $color-dialog-background-x
          .active
            border-bottom: 2px solid rgba(7, 17, 27, .7)
            .text
              color: $color-highlight-background
        .other-ul
          margin-top: 10px
          padding-bottom: 20px
          .other-li
            display: flex
            width: 100%
            padding-bottom: 10px
            padding-top: 10px
            .user-pic
              flex: 0 0 40px
              width: 40px
              margin-right: 8px
              .pic
                width: 100%
                min-height: 40px
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
              .show-height
                height: 78px
                overflow: hidden
              .show-more
                padding: 10px 0
                text-align: center
                border-top: 1px solid rgba(7, 17, 27, .1)
                .more
                  padding: 10px
                  line-height: 20px
                  font-size: 14px
                  color: #4876FF
        .empty-reply, .empty-praise
          margin-top: 10px
          text-align: center
          padding-bottom: 10px
          .text
            font-size: 12px
            color: #999
        .praise-ul
          margin-top: 10px
          padding-bottom: 20px
          .praise-li
            display: flex
            width: 100%
            padding-bottom: 10px
            padding-top: 10px
            border-1px(rgba(7, 17, 27, .1))
            .user-pic
              flex: 0 0 40px
              width: 40px
              margin-right: 8px
              .pic
                width: 100%
                min-height: 40px
                border-radius: 50%
            .praise-content
              flex: 1
              .user
                line-height: 20px
                // margin-top: 5px
                font-size: $font-size-medium
                color: $color-dialog-background
              .time
                line-height: 20px
                margin-top: 5px
                font-size: $font-size-small
                color: $color-dialog-background-x
    .reply-praise
      position: fixed
      width: 100%
      bottom: 0
      overflow: hidden
      background: #f2f2f2
      z-index: 111
    .loading-container
      position: absolute
      bottom: 0
      top: 0
      left: 0
      right: 0
      overflow: hidden
      background: rgba(7, 17, 27, .8)
      z-index: 1111
    .empty
      position: fixed
      top: 0
      bottom: 0
      right: 0
      left: 0
      background: #fff
      text-align: center
      z-index: 1000
      .empty-img
        margin-top: 40%
        &>img
          border-radius: 50%
      .text
        width: 100%
        color: $color-dialog-background-x
        font-size: $font-size-small
</style>
