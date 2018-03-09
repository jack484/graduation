<template>
  <transition name="router-slid" mode="out-in">
  <scroll ref="scroll" :data="noticeWishList" class="wish-page">
    <div class="wish-container">
      <div class="other-title">
        <p class="line"></p>
        <span class="text" v-if="service == 'SVCQY10011'">大家的祝福</span>
        <span class="text" v-else>我的互动</span>
        <span class="len"> ({{noticeWishList.length}})</span>
        <p class="line"></p>
      </div>
      <ul class="other-ul" v-if="noticeWishList.length > 0">
        <li class="other-li" v-for="(item, index) in noticeWishList">
          <div class="user-pic">
            <img class="pic" :src="item.avatar" v-if="item.avatar != '/0' ">
            <img v-else class="pic" src="../logo.jpg" alt="">
          </div>
          <div class="other-content">
            <div class="reply-user">
              <span class="title">{{item.wishusername}}</span>
              <button class="icon-del"
              v-if="item.wishUserId === currentUserId"
              @click="delComment(index, item.noticeid, item.noticewishid)"></button>
              <button v-else class="icon-comment" @click.stop="commentOther(index, item.noticeid, item.noticewishid)"></button>
            </div>
            <div class="reply-time">
              <p class="time">{{item.wishtime | showTime}}</p>
              <!-- <p class="text">{{item.wishcontent}}</p> -->
              <p class="text" v-html="replace_em(item.wishcontent)"></p>
            </div>
            <div class="reply-img" v-if="item.wishimage">
              <div v-for="img in wishImg" alt="" v-if="img.id == item.wishimage">
                <img width="50" height="50" :src="img.imgUrl">
              </div>
              <span class="text" v-for="imgName in wishImg" v-if="imgName.id == item.wishimage">{{imgName.name}}</span>
            </div>
            <!-- 回复别人的评论 -->
            <ul class="other-reply" v-if="item.caresresponselist.length>0">
              <li class="reply-list" v-for="(list, index) in item.caresresponselist">
                <div class="reply-avatar">
                  <img :src="list.avatar" v-if="list.avatar">
                  <img v-else class="pic" src="../logo.jpg" alt="">
                </div>
                <div class="reply-content">
                  <h1 class="title">
                    <span class="reply-user-name">{{list.wishUserName}}</span>回复
                    <span class="reply-object">{{list.replyToObject}}</span>
                    <button class="icon-del"
                    v-if="list.wishUserId === currentUserId"
                    @click="closeComment(index, list.noticeId, list.wishResponseId)"></button>
                    <button v-else class="icon-comment" @click.stop.prevent="commentOther(index, list.noticeId, list.wishResponseId)"></button>
                  </h1>
                  <p class="_time">{{list.wishTime | showTime}}</p>
                  <!-- <p class="text">{{list.wishContent}}</p> -->
                  <p class="text" v-html="replace_em(list.wishContent)"></p>
                  <div class="reply-img" v-if="list.wishImage">
                    <div v-for="img in wishImg" alt="" v-if="img.id == item.wishImage">
                      <img width="50" height="50" :src="img.imgUrl">
                    </div>
                    <span class="text" v-for="imgName in wishImg" v-if="imgName.id == item.wishImage">{{imgName.name}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div v-else class="empty-reply">
        <span class="text">暂无祝福</span>
      </div>
    </div>
    <commentList v-show="showCommentList"
      @hidComment="hidComment"
      @onConfirm="onConfirm"></commentList>
  </scroll>
  </transition>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import commentList from 'base/commentList/commentList'
  import {formatDate} from 'common/js/date'
  import { Toast } from 'vant'
  import *as api from 'api/api'
  import http from 'api/http'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    filters: {
      // 时间格式化过滤器
      showTime(_date) {
        if (_date) {
          return formatDate(new Date(_date *1000), "yyyy-MM-dd hh:mm:ss")
        } else {
          return ''
        }
      },
      // 时间格式化过滤器
      dateTime(_date) {
        if (_date) {
          return formatDate(new Date(_date *1000), "MM月dd日")
        } else {
          return ''
        }
      },
    },
    data() {
      return {
        wishImg:[
          {name: '生日蛋糕', imgUrl:require('../../../../../static/images/wish/wish_image_001.jpg'),id: 'wish_image_001.jpg'},
          {name: '冰淇淋', imgUrl:require('../../../../../static/images/wish/wish_image_002.jpg'),id: 'wish_image_002.jpg'},
          {name: '水晶球', imgUrl:require('../../../../../static/images/wish/wish_image_003.jpg'),id: 'wish_image_003.jpg'},
          {name: '玫瑰花', imgUrl:require('../../../../../static/images/wish/wish_image_004.jpg'),id: 'wish_image_004.jpg'},
          {name: '雪人', imgUrl:require('../../../../../static/images/wish/wish_image_005.jpg'),id: 'wish_image_005.jpg'},
          {name: '钻石戒指', imgUrl:require('../../../../../static/images/wish/wish_image_006.jpg'),id: 'wish_image_006.jpg'},
          {name: '奖杯', imgUrl:require('../../../../../static/images/wish/wish_image_007.jpg'),id: 'wish_image_007.jpg'},
          {name: '红酒', imgUrl:require('../../../../../static/images/wish/wish_image_008.jpg'),id: 'wish_image_008.jpg'},
          {name: '巧克力', imgUrl:require('../../../../../static/images/wish/wish_image_009.jpg'),id: 'wish_image_009.jpg'},
          {name: '水果篮', imgUrl:require('../../../../../static/images/wish/wish_image_010.jpg'),id: 'wish_image_010.jpg'},
          {name: '爱心抱枕', imgUrl:require('../../../../../static/images/wish/wish_image_011.jpg'),id: 'wish_image_011.jpg'},
          {name: '女士包包', imgUrl:require('../../../../../static/images/wish/wish_image_012.jpg'),id: 'wish_image_012.jpg'},
          {name: '咖啡', imgUrl:require('../../../../../static/images/wish/wish_image_013.jpg'),id: 'wish_image_013.jpg'},
          {name: '跑车', imgUrl:require('../../../../../static/images/wish/wish_image_014.jpg'),id: 'wish_image_014.jpg'},
          {name: '单反相机', imgUrl:require('../../../../../static/images/wish/wish_image_015.jpg'),id: 'wish_image_015.jpg'},
          {name: '抱枕', imgUrl:require('../../../../../static/images/wish/wish_image_016.jpg'),id: 'wish_image_016.jpg'},
          {name: '阿拉丁神灯', imgUrl:require('../../../../../static/images/wish/wish_image_017.jpg'),id: 'wish_image_017.jpg'},
          {name: '甜甜圈', imgUrl:require('../../../../../static/images/wish/wish_image_018.jpg'),id: 'wish_image_018.jpg'},
          {name: '太阳眼镜', imgUrl:require('../../../../../static/images/wish/wish_image_019.jpg'),id: 'wish_image_019.jpg'},
          {name: '风铃', imgUrl:require('../../../../../static/images/wish/wish_image_020.jpg'),id: 'wish_image_020.jpg'},
          {name: '旋转木马', imgUrl:require('../../../../../static/images/wish/wish_image_021.jpg'),id: 'wish_image_021.jpg'},
          {name: '糖果', imgUrl:require('../../../../../static/images/wish/wish_image_022.jpg'),id: 'wish_image_022.jpg'},
          {name: '盆栽', imgUrl:require('../../../../../static/images/wish/wish_image_023.jpg'),id: 'wish_image_023.jpg'},
          {name: '香水', imgUrl:require('../../../../../static/images/wish/wish_image_024.jpg'),id: 'wish_image_024.jpg'},
          {name: '粉红小熊', imgUrl:require('../../../../../static/images/wish/wish_image_025.jpg'),id: 'wish_image_025.jpg'},
          {name: 'zippo打火机', imgUrl:require('../../../../../static/images/wish/wish_image_026.jpg'),id: 'wish_image_026.jpg'},
          {name: '两只小熊', imgUrl:require('../../../../../static/images/wish/wish_image_027.jpg'),id: 'wish_image_027.jpg'},
          {name: '项链', imgUrl:require('../../../../../static/images/wish/wish_image_028.jpg'),id: 'wish_image_028.jpg'},
        ],
        pageNum: 1,
        pageSize: 20,
        noticeWishList: [],
        currentUserId: '',
        imgurl: '../../../../../static/images/wish/',
        showCommentList: false,
        service: null,
      }
    },
    created() {
      this.currentUserId = this.$route.query.currentUserId
      this.service = this.$route.query.service
      // console.log(this.service)
    },
    computed: {
      ...mapGetters([
        'getSessionKey'
      ])
    },
    mounted() {
      this.receiveBlessDatas()
    },
    methods: {
      ...mapActions([
        'saveNoticeId', 'saveResponseId'
      ]),
      // 获取大家的祝福
      async receiveBlessDatas() {
        let params = {
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
          "sessionKey": this.getSessionKey,
        }
        let url = api.serviceUrl + this.getSessionKey
        const resBless = await http.post(url, this.service, params)
        if (resBless.data.code === api.ERR_OK) {
          let response = resBless.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          this.noticeWishList = response.noticeWishList.list
          // console.log(this.noticeWishList)
        } else {
          Toast({
            duration: 1000,
            message: resBless.data.msg
          })
        }
      },
      // 删除一级祝福
      async delComment(index, noticeid, id) {
        this.noticeWishList.splice(index, 1)
        let params = {
          "noticeId": noticeid,
          "noticeWishId": id,
        }
        let url = api.serviceUrl + this.getSessionKey
        const delReplyBless = await http.post(url, api.serviceDelBless, params)
        if (delReplyBless.data.code === api.ERR_OK) {
          Toast({
            duration: 1000,
            message: '删除成功'
          })
          // this.receiveBlessDatas()
        } else {
          Toast({
            duration: 1000,
            message: '删除失败'
          })
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
      // 删除二级祝福
      async closeComment(index, noticeId, id) {

        let params = {
          "noticeId": noticeId,
          "noticeWishId": id,
        }
        let url = api.serviceUrl + this.getSessionKey
        const closeReplyBless = await http.post(url, api.serviceDelBless, params)
        // console.log(closeReplyBless)
        if (closeReplyBless.data.code === api.ERR_OK) {
          Toast({
            duration: 1000,
            message: '删除成功'
          })
          this.receiveBlessDatas()
        } else {
          Toast({
            duration: 1000,
            message: '删除失败'
          })
        }
      },
      // 回复祝福
      commentOther(index, noticeid, id) {
        // console.log(id)
        this.saveNoticeId(noticeid)
        this.saveResponseId(id)
        this.showCommentList = true
      },
      hidComment() {
        this.showCommentList = false
      },
      onConfirm() {
        this.receiveBlessDatas()
        this.showCommentList = false
      },
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

  .wish-page
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 111
    overflow: hidden
    background: #fff
    .wish-container
      margin: 10px 18px
      .other-title
        display: flex
        justify-content: center
        align-items: center
        padding-top: 10px
        margin-bottom: 30px
        text-shadow: 0 5px 5px rgba(7, 17, 27, .4)
        color: #000
        .line
          height: 1px
          width: 30px
          background: #000
          box-shadow: 0 5px 5px rgba(7, 17, 27, .1)
        .text
          font-size: 14px
          line-height: 20px
          margin-left: 10px
          margin-right: 5px
        .len
          font-size: 14px
          line-height: 20px
          margin-right: 10px
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
                outline: none
                background: transparent
                border: none
                font-size: 16px
                color: $color-dialog-background-x
            .reply-time
              line-height: 20px
              .time
                font-size: $font-size-small
                color: $color-dialog-background-x
              .text
                font-size: $font-size-medium
            .reply-img
              display: flex
              margin-top: 5px
              padding: 0 5px
              border: 1px solid rgba(7, 17, 27, .1)
              box-sizing: border-box
              border-radius: 3px
              background: #fff
              .text
                line-height: 50px
                font-size: 14px
                color: #666
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
                      outline: none
                      background: transparent
                      border: none
                      color: #999
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
                  .reply-img
                    display: flex
                    margin-top: 5px
                    padding: 0 5px
                    border: 1px solid rgba(7, 17, 27, .1)
                    box-sizing: border-box
                    border-radius: 3px
                    .text
                      line-height: 50px
                      font-size: 14px
                      color: #666
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
      .empty-reply
        padding: 10px 18px 20px
        text-align: center
        font-size: 12px
        color: #999
    .router-slid-enter-active, .router-slid-leave-active
      transition: all 0.3s
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(30px, 0, 0)
      opacity: 0
</style>
