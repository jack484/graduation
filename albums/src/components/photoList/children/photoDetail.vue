<template>
  <div class="detail" >
    <scroll ref="detail" class="detail-container" :data="replyList" :mouseWheel="mouseWheel">
      <div>
      <div class="photo-wrapp" @click="showPicture(v_index)">
        <div class="num">
          <span class="left-num">{{v_index+1}}</span> /
          <span class="right-num">{{getPhotoList.length}}</span>
        </div>
        <img :src="apiImgUrl + photoList.realpath" style="width: 100%">
      </div>
      <div class="btn">
        <div class="prev">
          <span class="icon-left"></span>
          <button class="text" id="leftBtn" @click.stop="prevClick(v_index)">上一张</button>
        </div>
        <span class="vertical"><i></i></span>
        <div class="next" >
          <button class="text" id="leftBtn" @click.stop="nextClick(v_index)">下一张</button>
          <span class="icon-right"></span>
        </div>
      </div>
      <div class="reply-container">
        <div ref="replyHead" class="reply-head border-1px">
          <div class="reply" @click.stop="switchClick('reply')" :class="{'active': isActive == 'reply'}">
            <span class="text">评论 ({{replyList.length}})</span>
          </div>
          <div class="praise" @click.stop="switchClick('praise')" :class="{'active': isActive == 'praise'}">
            <span class="text">赞 ({{praiseList.length}})</span>
          </div>
        </div>
        <!-- 评论 -->
        <div v-if="isShowSwitch">
          <ul class="other-ul" v-if="replyList.length > 0">
            <li class="other-li" v-for="(item, index) in replyList">
              <div class="user-pic">
                <img class="pic" :src="item.avatar" v-if="item.avatar">
                <!-- <img v-else class="pic" src="../test.jpg" alt=""> -->
              </div>
              <div class="other-content">
                <div class="reply-user">
                  <span class="title">{{item.replyUserName}}</span>
                  <button class="icon-del"
                  v-if="item.replyUserId === currentUserId"
                  @click="delComment(index, item.albumsId, item.albumsDetailId, item.albumsReplyId)"></button>
                  <button v-else class="icon-comment" @click.stop.prevent="commentOther(index, item.albumsId, item.albumsDetailId, item.albumsReplyId, )"></button>
                </div>
                <div class="reply-time">
                  <p class="time">{{item.replyDate | dateTime}}</p>
                  <p class="text" v-html="replace_em(item.replyContent)"></p>
                </div>
                <!-- 回复别人的评论 -->
                <ul class="other-reply" :class="{'show-height': isShowHeight}" v-if="item.replyResponseList.length>0">
                  <li class="reply-list" v-for="(list, index) in item.replyResponseList">
                    <div class="reply-avatar">
                      <img :src="list.avatar">
                    </div>
                    <div class="reply-content">
                      <h1 class="title">
                        <span class="reply-user-name">{{list.replyUserName}}</span>回复
                        <span class="reply-object">{{list.replyToObject}}</span>
                        <button class="icon-del"
                        v-if="list.replyUserId === currentUserId"
                        @click.stop="closeComment(index, list.albumsId, list.albumsDetailId, list.albumsResponseId)"></button>
                        <button v-else class="icon-comment" @click.stop.prevent="commentOther(index, list.albumsId, list.albumsDetailId, list.albumsResponseId)"></button>
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
            <span class="text">沙发还在，快来抢呀!</span>
          </div>
        </div>
        <!-- 点赞 -->
        <div v-else>
          <ul class="praise-ul" v-if="praiseList.length > 0">
            <li class="praise-li border-1px" v-for="praise in praiseList">
              <div class="user-pic">
                <img class="pic" :src="praise.praiserUser.avatar">
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
    </scroll>
    <silder :photoList="getPhotoList" v-if="isShowRemark" @hidShowPic="hidShowPic" :currentIndex="v_index"></silder>
    <div class="reply-praise">
      <replyPraise :albumsId="albumsId"
        :albumsDetailId="albumsDetailId"
        :replyList="replyList"
        @onWriteComment="onWriteComment"
        @confirmPraise="confirmPraise"
        @confirmFavorit.stop="confirmFavorit"
        @goReplyWrapp="goReplyWrapp"></replyPraise>
    </div>
    <commentList v-show="showCommentList"
      :albumsId="albumsId"
      :albumsDetailId="albumsDetailId"
      @hidComment="hidComment"
      @onConfirm="onConfirm"
      @onConfirmReply="onConfirmReply"></commentList>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Silder from 'base/silder/silder'
  import replyPraise from 'base/replyPraise/replyPraise'
  import commentList from 'base/commentList/commentList'
  import {formatDate} from 'common/js/date'
  import {mapGetters, mapActions} from 'vuex'
  import *as api from 'api/api'
  import http from 'api/http'
  import { Toast } from 'vant'
  import Slide from 'base/slide/slide'

  export default {
    filters: {
      // 时间格式化过滤器
      showTime(p_inputTimeStamp) {
        if (p_inputTimeStamp) {
          return formatDate(new Date(p_inputTimeStamp *1000), "yyyy-MM-dd hh:mm:ss")
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
        imgUrl: null,
        replyNum: null,
        praiseNum: null,
        v_index: null, // 接受父组件传过来的index
        albumsDetailId: null,
        albumsId: null,
        showImgUrl: null,
        isShowRemark: false,
        currentIndex: null, // 当前的index
        photoList: [], // 照片详情
        apiImgUrl: api.imgUrl, // 初始化图片路径
        mySiema: null,
        praiseList: [],
        replyList: [],
        inputValue: null, // 输入评论的内容
        isActive: 'reply',
        isShowSwitch: true,
        isMoreButton: true,
        currentUserId: null,
        showCommentList: false, // 是否显示评论输入框
        isShowHeight: false,
        praiseFlag: '', // 点赞状态 Y为已赞， N为未赞
        mouseWheel: true,
        turnToPrev: false,
        turnToNext: false,
        isAutoPlay: false,
        isLoop: false,
        isShowDot: false,
        speed: 400,
        threshold: 0.3,
        interval: 4000
      }
    },
    beforeDestroy() {
    // 实例销毁之前清除定时器，优化性能。在这一步，实例仍然完全可用。
      clearTimeout(this.timer)
    },
    created() {
      this.albumsId = this.$route.query.albumsId
      this.albumsDetailId = this.$route.query.albumsDetailId
      this.v_index = this.$route.query.index
    },
    computed: {
      ...mapGetters([
        'getPhotoList', 'getSessionKey'
      ])
    },
    mounted() {
      this.fetchPhotoList()
      this.getData()
    },
    methods: {
      ...mapActions([
        'saveAlbumsReplyId', 'saveAlbumsId', 'saveAlbumsDetailId', 'savePraise'
      ]),
      fetchPhotoList(curIndex) {
        if (this.getPhotoList) {
          if (curIndex) {
            this.photoList = this.getPhotoList[curIndex]
          } else {
            this.photoList = this.getPhotoList[this.v_index]
          }
        }
      },
      // 获取详情页数据
      async getData(currentIndex) {
        let albumsDetailId = ''
        if (currentIndex) {
          albumsDetailId = this.getPhotoList[currentIndex].albumsDetailId
        } else {
          albumsDetailId = this.getPhotoList[this.v_index].albumsDetailId
        }
        let params = {
          "albumsId": this.albumsId,
          "albumsDetailId": albumsDetailId,
          "sessionKey": this.getSessionKey,
        }
        let url = api.serviceUrl + this.getSessionKey
        const albumsDetailData = await http.post(url, api.serviceAlbumsDetail, params)
        if (albumsDetailData.data.code === api.ERR_OK) {
          let response = albumsDetailData.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          this.praiseFlag = response.praiseFlag
          this.replyList = response.replyList
          this.praiseList = response.praiseList
          this.currentUserId = response.currentUserId
          // console.log(this.replyList)
          // console.log(this.praiseList)
          // console.log(this.replyList.length)
          // console.log(this.praiseFlag)
          this.savePraise(this.praiseFlag)
          this.replyList.forEach((list) => {
            if (list.replyResponseList.length > 2) {
              this.isShowHeight = true
            }
          })
        } else {
          Toast({
            duration: 1000,
            message: albumsDetailData.data.msg
          })
        }
      },
      showPicture(index) {
        this.isShowRemark = true
        this.currentIndex = index
        // console.log(this.isShowRemark)
      },
      hidShowPic() {
        this.isShowRemark = false
      },
      // 替换qq表情路径地址
      replace_em(str){
        str = str.replace(/\</g,'&lt;')
        str = str.replace(/\>/g,'&gt;')
        str = str.replace(/\n/g,'<br/>')
        str = str.replace(/\[em_([0-9]*)\]/g,'<img src="static/images/faceQQ/$1.gif"/>')
        return str
      },
      // 评论和点赞切换
      switchClick(s) {
        this.isActive = s
        if (s == 'reply') {
          this.isShowSwitch = true
        } else {
          this.isShowSwitch = false
        }
      },
      // 上一张
      prevClick() {
        if (this.v_index == 0) {
          Toast({
            duration: 1000,
            message: '这是第一张照片啦！'
          })
          this.v_index = 0
          this.albumsId = this.getPhotoList[this.v_index].albumsId
          this.albumsDetailId = this.getPhotoList[this.v_index].albumsDetailId
          this.fetchPhotoList(this.v_index)
          this.getData(this.v_index)
          return
        } else {
          this.v_index--
          this.albumsId = this.getPhotoList[this.v_index].albumsId
          this.albumsDetailId = this.getPhotoList[this.v_index].albumsDetailId
          this.fetchPhotoList(this.v_index)
          this.getData(this.v_index)
        }
      },
      // 下一张
      nextClick() {
        this.v_index++
        if (this.v_index > this.getPhotoList.length-1) {
          Toast({
            duration: 1000,
            message: '这是最后一张照片啦！'
          })
          this.v_index = this.getPhotoList.length-1
          return
        } else {
          this.albumsId = this.getPhotoList[this.v_index].albumsId
          this.albumsDetailId = this.getPhotoList[this.v_index].albumsDetailId
          this.fetchPhotoList(this.v_index)
          this.getData(this.v_index)
        }
      },
      // 删除一级评论
      async delComment(index, albumsId, albumsDetailId, albumsReplyId) {
        this.replyList = this.replyList.filter((item) => item.albumsReplyId !== albumsReplyId)
        let params = {
          "albumsId": albumsId,
          "albumsDetailId": albumsDetailId,
          "albumsReplyId": albumsReplyId,
          "sessionKey": this.getSessionKey,
        }
        let url = api.serviceUrl + this.getSessionKey
        const delCommentDatas = await http.post(url, api.serviceDel, params)
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
      commentOther(index, albumsId, albumsDetailId, albumsReplyId) {
        this.saveAlbumsDetailId(albumsDetailId)
        this.saveAlbumsId(albumsId)
        this.saveAlbumsReplyId(albumsReplyId)
        this.showCommentList = true
      },
      // 删除二级评论
      async closeComment(index, albumsId, albumsDetailId, albumsResponseId) {
        this.replyList.forEach((list) => {
          if (list.replyResponseList.length > 0) {
            list.replyResponseList.splice(index, 1)
          }
        })

        let params = {
          "albumsId": albumsId,
          "albumsDetailId": albumsDetailId,
          "albumsReplyId": albumsResponseId,
          "sessionKey": this.getSessionKey,
        }
        let url = api.serviceUrl + this.getSessionKey
        const closeCommentDatas = await http.post(url, api.serviceDel, params)
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
      onShowMoreReply() {
        this.isShowHeight = false
        this.isMoreButton = false
      },
      hidMoreReply() {
        this.isShowHeight = true
        this.isMoreButton = true
      },
     // 唤出评论窗口
      onWriteComment() {
        this.showCommentList = true
      },
      confirmPraise() {
        console.log(this.v_index)
        this.getData(this.v_index)
      },
      confirmFavorit() {

      },
      goReplyWrapp() {

      },
      hidComment() {
        this.showCommentList = false
      },
      onConfirm() {
        this.getData()
        this.showCommentList = false
      },
      onConfirmReply() {
        this.getData()
        this.showCommentList = false
      },
    },
    components: {
      Scroll,
      Silder,
      replyPraise,
      commentList,
      Slide,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .detail
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 111
    overflow: hidden
    background: #fff
    .detail-container
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 40px
      z-index: 111
      overflow: hidden
      background: #fff
      .photo-wrapp
        width: 100%
        // height: 240px
        .siema
          width: 100%
          height: 100%
          text-align: center
          margin: auto
          .photo-list
            position: relative
            width: 100%
            // height: 100%
            .show-btn
              position: absolute
              top: 0
              left: 0
              right: 0
              bottom: 0
              width: 100%
              background: transparent
              outline: none
              border: none
            img
              width: 100%
        .num
          position: absolute
          top: 10px
          right: 10px
          padding: 3px 5px
          border-radius: 5px
          background: rgba(7, 17, 27, .1)
          color: #fff
          font-size: 12px
      .btn
        display: flex
        margin: 20px 18px
        background: rgba(7, 17, 27, .05)
        border-radius: 8px
        .prev, .next
          flex: 0 0 100px
          width: 100px
          padding: 10px 0
          .text
            line-height: 28px
            padding: 5px 10px
            font-size: $font-size-medium-x
            color: $color-highlight-background
            outline: none
            border: none
            background: transparent
        .prev
          margin-left: 5px
          .icon-left
            display: inline-block
            line-height: 26px
            font-size: $font-size-medium-x
            color: $color-dialog-background-x
        .next
          margin-right: 5px
          text-align: right
          .icon-right
            display: inline-block
            line-height: 26px
            font-size: $font-size-medium
            color: $color-dialog-background-x
        .vertical
          flex-grow: 1
          display: inline-block
          height: 38px
          padding: 10px 0
          text-align: center
          i
            display: inline-block
            height: 100%
            border-right: 1px solid rgba(7, 17, 27, .3)
      .confirm-reply
        position: fixed
        bottom: 0
        height: 40px
        width: 100%
        background: rgba(7, 17, 27, .05)
        .reply-wrapp
          display: flex
          margin: 0 18px
          .reply-ipt
            flex: 1
            background: #fff
            margin: 5px 0
            height: 30px
            border-radius: 20px
            display: flex
            .icon-write
              flex: 0 0 30px
              width: 30px
              line-height: 30px
              margin-left: 3px
              font-size: $font-size-medium-x
              color: $color-dialog-background-x
            .write-ipt
              flex: 1
              line-height: 30px
              border-top-right-radius: 20px
              border-bottom-right-radius: 20px
              outline: none
              font-size: $font-size-medium-x
              color: $color-highlight-background
            input::-webkit-input-placeholder
              color: $color-dialog-background-x
              font-size: $font-size-medium
          .confirm-wrapp
            flex: 0 0 70px
            width: 70px
            text-align: center
            margin-right: -10px
            .icon-word, .icon-praise
              margin-left: 5px
              padding: 3px 5px
              line-height: 40px
              font-size: $font-size-medium-x
            .icon-praise
              color: $color-dialog-background-x
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
                  border: none
                  outline: none
                  background: transparent
                .icon-comment
                  padding: 0
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
                        border: none
                        outline: none
                        background: transparent
                      .icon-comment
                        padding: 0
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
            padding: 10px 0
            border-1px(rgba(7, 17, 27, .1))
            .user-pic
              flex: 0 0 40px
              width: 40px
              margin-right: 8px
              .pic
                width: 100%
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
      z-index: 102
</style>
