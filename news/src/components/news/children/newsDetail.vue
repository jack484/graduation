<template>
  <div class="news-detail">
    <scroll ref="newsDetail" class="detail-wrapp" :data="scrollList" :mouseWheel="mouseWheel">
      <div v-if="newsList">
        <!-- 标题、副标题区 -->
        <div class="detail-head">
          <div class="news-title">
            <span class="title">{{newsList.title}}</span>
          </div>
          <div class="head-other">
            <div class="time-desc">
              <span class="time">{{newsList.publishtime | showTime}}</span>
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
        <!-- 下一篇 -->
        <div class="next-chapter">
          <!-- <span class="next">下一篇：</span>
          <div class="title border-1px">
            <span class="text">当年明月</span> |
            <span class="category-name">微图说</span>
          </div> -->
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
                  <img v-else class="pic" src="../logo.jpg" alt="">
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
                    <!-- <p class="text">{{replace_em(item.replyContent)}}</p> -->
                    <p class="text" v-html="replace_em(item.replyContent)"></p>
                  </div>
                  <!-- 回复别人的评论 -->
                  <ul class="other-reply" :class="{'show-height': isShowHeight}" v-if="item.replyResponseList.length>0">
                    <li class="reply-list" v-for="(list, index) in item.replyResponseList">
                      <div class="reply-avatar">
                        <img :src="list.avatar" v-if="list.avatar != null && list.avatar">
                        <img v-else class="pic" src="../logo.jpg" alt="">
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
                        <!-- <p class="text">{{replace_em(list.replyContent)}}</p> -->
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
                  <img v-else class="pic" src="../logo.jpg" alt="">
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
        <div class="loading-container" v-show="isShowLoading">
          <loading ></loading>
        </div>
      </div>
      <div v-else class="empty">
        <div class="empty-img">
          <img src="../empty.jpg" width="140" height="105">
        </div>
        <span class="text">暂无相关数据</span>
      </div>
    </scroll>
    <replyPraise :newsId="newsId"
    :newsReplyList="newsReplyList"
    @onWriteComment="onWriteComment"
    @confirmPraise="confirmPraise"
    @confirmFavorit="confirmFavorit"
    @goReplyWrapp="goReplyWrapp"></replyPraise>
    <commentList v-show="showCommentList"
    :newsId="newsId"
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
  import {mapGetters, mapActions} from 'vuex'
  import *as api from 'api/api'
  import http from 'api/http'
  import {formatDate} from 'common/js/date'
  import { Toast } from 'vant'
  import Vue from 'vue'

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
        newsList: '',
        newsDetailList: [],
        newsReadList: [], // 阅读用户数据
        newsPraiseList: [], // 点赞用户数据
        newsReplyList: [], // 评论用户数据
        v_index: null,
        scrollList: [],
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
        currentReadList: [],
        mouseWheel: true,
        minutes: null,
        seconds: null,
        result: '',
      }
    },
    created() {
      this.v_index = this.$route.query.index
      this.newsId = this.$route.query.newsid
    },
    computed: {
      showHid() {
        return this.msg ? '展开' : '收起'
      },
      ...mapGetters([
        'getNewsList', 'getSessionKey'
      ])
    },
    mounted() {
      this.fetchNewsList()
      this.getNewsDetail()
    },
    methods: {
      ...mapActions([
        'savePraise', 'saveCollectFlag', 'saveNewsResponseId',
      ]),
      async getNewsDetail() {
        let url = api.serviceUrl + this.getSessionKey
        let params = {
          "newsId": this.newsId,
          "sessionKey": this.getSessionKey,
        }
        const newsDetails = await http.post(url, api.serviceNewsDetail, params)
        // console.log(newsDetails)
        if (newsDetails.data.code === api.ERR_OK) {
          let response = newsDetails.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          // console.log(response)
          this.newsReadList = response.readList
          this.newsPraiseList = response.praiseList
          this.newsReplyList = response.replyList
          this.praiseFlag = response.praiseFlag
          this.collectFlag = response.collectFlag
          this.currentUserId = response.currentUserId
          // console.log(this.currentUserId)
          // console.log(this.newsReadList)
          // console.log(this.newsPraiseList)
          // console.log(this.newsReplyList)
          if (this.newsReadList.length > 50) {
            this.currentReadList = this.newsReadList.slice(0, 50)
          }
          this.savePraise(this.praiseFlag)
          this.saveCollectFlag(this.collectFlag)
          this.isShowLoading = false
          this.newsReplyList.forEach((list) => {
            if (list.replyResponseList.length > 2) {
              this.isShowHeight = true
            }
          })
        } else {
          this.isShowLoading = false
          Toast({
            duration: 1000,
            message: newsDetails.data.msg
          })
        }
      },
      fetchNewsList() {
        let index = this.v_index
        if (this.getNewsList) {
          this.scrollList = this.getNewsList
          this.newsList = this.getNewsList[index]
          // console.log(this.newsList.content)

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
          // console.log(this.v_html)

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
                      // audio.ontimeupdate = function() {myFunction()}
                      // let self = this
                      // function myFunction() {
                      // // 显示 id="demo" 的 <p> 元素中音频的播放位置
                      //   let t = audio.currentTime.toFixed(0)
                      //   let secondTime = parseInt(t)// 秒
                      //   let minuteTime = 0// 分
                      //   let hourTime = 0// 小时
                      //   if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
                      //     //获取分钟，除以60取整数，得到整数分钟
                      //     minuteTime = parseInt(secondTime / 60)
                      //     //获取秒数，秒数取佘，得到整数秒数
                      //     secondTime = parseInt(secondTime % 60)
                      //     //如果分钟大于60，将分钟转换成小时
                      //     if(minuteTime > 60) {
                      //       //获取小时，获取分钟除以60，得到整数小时
                      //       hourTime = parseInt(minuteTime / 60)
                      //       //获取小时后取佘的分，获取分钟除以60取佘的分
                      //       minuteTime = parseInt(minuteTime % 60)
                      //     }
                      //   }
                      //   self.result = '0'+":"+parseInt(secondTime)
                      //   if(minuteTime > 0) {
                      //     self.result = "" + parseInt(minuteTime) + ":" + self.result
                      //   }
                      //   document.getElementById("demo").innerHTML = self.result
                      // }

                      // let minutes = (audio.duration/60).toFixed(2)
                      // const audioTime = Vue.extend({
                      //   template: `'<span style="position: absolute;bottom: 10px;right: 10px;font-size: 12px"> ${minutes}</span>'`
                      // })
                      // const markTime = new audioTime().$mount()
                      // _music[i].appendChild(markTime.$el)

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
              // console.log(vid[1])
              this.showVideo(vid)
            }
          })
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
      switchClick(s) {
        this.isActive = s
        this.isShowSwitch = !this.isShowSwitch
      },
      // 腾讯视频统一播放器转换
      showVideo(_setVid) {
        // if () {}
        let video = new tvp.VideoInfo()
        // console.log(video)
        video.setVid(_setVid)
        let player = new tvp.Player()
        // console.log(player)
        player.create({
          width: 320,       //播放器的宽度
          height: 240,     //播放器的高度
          video: video,       //默认的视频对象
          modId: 'testId',       //默认的 DOM 元素 ID
          autoplay: false,
          // pic: imgURL
        });
        player.onplaying = function (vid){
          // console.log(vid)
        }
        player.onallended = function (vid){
          // console.log(vid)
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
        this.getNewsDetail()
        this.showCommentList = false
      },
      // 点赞
      confirmPraise() {
        // this.isShowSwitch = !this.isShowSwitch
        this.getNewsDetail()
      },
      // 收藏
      confirmFavorit() {
        this.getNewsDetail()
      },
      // 删除一级评论
      async delComment(index, id) {
        // console.log(index)
        // console.log(this.newsId)
        // console.log(id)
        // this.newsReplyList.splice(index, 1)
        this.newsReplyList = this.newsReplyList.filter((item) => item.newsReplyId !== id)
        let params = {
          "newsId": this.newsId,
          "newsReplyId": id,
          "sessionKey": this.getSessionKey,
        }
        let url = api.serviceUrl + this.getSessionKey
        const delCommentDatas = await http.post(url, api.serviceDelReply, params)
        // console.log(delCommentDatas)
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
          "sessionKey": this.getSessionKey,
        }
        let url = api.serviceUrl + this.getSessionKey
        const closeCommentDatas = await http.post(url, api.serviceDelReply, params)
        // console.log(closeCommentDatas)
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
        this.getNewsDetail()
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
        this.$refs.newsDetail.scrollToElement(this.$refs.replyHead, 1000, 100)
      }
    },
    watch: {
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
    bottom: 0
    top: 0
    left: 0
    right: 0
    overflow: hidden
    // background: #fff
    z-index: 101
    .detail-wrapp
      position: absolute
      bottom: 40px
      top: 0
      left: 0
      right: 0
      overflow: hidden
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
