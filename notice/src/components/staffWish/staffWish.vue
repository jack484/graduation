<template>
  <div class="wish-detail" >
    <scroll ref="scroll" class="detail-container" style="background: rgba(7, 17, 27, .05)" :data="noticeWishList" :mouseWheel="mouseWheel">
      <div>
      <!-- 头部信息 -->
      <div class="head">
        <div class="head-img">
          <img width="50" height="50" :src="noticeItem.avatar" alt="">
        </div>
        <div class="user-name">
          <span class="name">{{noticeItem.userName}}</span>
          <span class="icon">
            <i class="icon-man" v-if="noticeItem.gender == 1"></i>
            <i v-else class="icon-girl"></i>
          </span>
        </div>
        <p class="department">{{noticeItem.departmentName}}</p>
        <div class="solar-date">
          <p class="line"></p>
          <span class="user-date" style="margin-left: 10px;margin-right: 0" id="userDate">{{noticeItem.jobDate | dateTime}}</span>
          <span class="status" style="margin-left: 5px;margin-right: 10px;border-radius: 20px;padding: 3px 5px;">{{noticeItem.jobPeriod}}</span>
          <p class="line"></p>
        </div>
        <div class="head-other">
          <span class="text">您已进入公司 {{noticeItem.jobPeriod}}啦，祝您工作蒸蒸日上！</span>
        </div>
      </div>
      <!-- 背景蒙层 -->
      <div class="background">
        <img src="./bgTop1.png">
      </div>
      <!-- 收到的礼物图片 -->
      <div class="gift-wrapp">
        <h1 style="text-align: center; font-size: 14px; color: #333">收到的礼物 ({{fetchWishImg.length}})</h1>
        <div ref="giftImg" class="gift-img">
          <ul class="img-ul" ref="wishList" v-if="fetchWishImg.length>0">
            <li class="img-li" v-for="(item,index) in fetchWishImg" :key="item.id">
              <div v-for="img in wishImg" alt="" v-if="img.id == item">
                <img width="70" height="70" :src="img.imgUrl">
              </div>
            </li>
          </ul>
          <div v-else class="empty-wish">
            暂无礼物
          </div>
        </div>
      </div>
      <!-- 收到的祝福 -->
      <div class="other">
        <div class="other-title">
          <p class="line"></p>
          <span class="text">大家的祝福</span> <span class="len"> ({{noticeWishList.length}})</span>
          <p class="line"></p>
        </div>
        <ul class="other-ul" v-if="noticeWishList.length > 0">
          <li class="other-li" v-for="(item, index) in noticeWishList">
            <div class="user-pic">
              <img class="pic" :src="item.avatar" v-if="item.avatar != '/0' ">
              <img v-else class="pic" src="./logo.jpg" alt="">
            </div>
            <div class="other-content">
              <div class="reply-user">
                <span class="title">{{item.wishUserName}}</span>
                <button class="icon-del"
                v-if="item.wishUserId === noticeItem.userId"
                @click="delComment(index, item.noticeWishId)"></button>
                <button v-else class="icon-comment" @click.stop="commentOther(index, item.noticeWishId)"></button>
              </div>
              <div class="reply-time">
                <p class="time">{{item.wishTime | showTime}}</p>
                <p class="text" v-html="replace_em(item.wishContent)"></p>
              </div>
              <div class="reply-img" v-if="item.wishImage">
                <div v-for="img in wishImg" alt="" v-if="img.id == item.wishImage">
                  <img width="50" height="50" :src="img.imgUrl">
                </div>
                <span class="text" v-for="imgName in wishImg" v-if="imgName.id == item.wishImage">{{imgName.name}}</span>
              </div>
              <!-- 回复别人的评论 -->
              <ul class="other-reply" v-if="item.caresResponseList.length>0">
                <li class="reply-list" v-for="(list, index) in item.caresResponseList">
                  <div class="reply-avatar">
                    <img :src="list.avatar" v-if="list.avatar">
                    <img v-else class="pic" src="./logo.jpg" alt="">
                  </div>
                  <div class="reply-content">
                    <h1 class="title">
                      <span class="reply-user-name">{{list.wishUserName}}</span>回复
                      <span class="reply-object">{{list.replyToObject}}</span>
                      <button class="icon-del"
                      v-if="list.wishUserId === noticeItem.userId"
                      @click="closeComment(index, list.wishResponseId)"></button>
                      <button v-else class="icon-comment" @click.stop.prevent="commentOther(index, list.wishResponseId)"></button>
                    </h1>
                    <p class="_time">{{list.wishTime | showTime}}</p>
                    <!-- <p class="text">{{list.wishContent}}</p> -->
                    <p class="text" v-html="replace_em(list.wishContent)"></p>
                    <div class="reply-img" v-if="list.wishImage">
                      <!-- <img width="50" height="50" :src="imgurl+ item.wishImage" alt=""> -->
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
    </div>
    </scroll>
    <commentNotice v-show="showCommentList"
      :noticeId="noticeId"
      @hidComment="hidComment"
      @onConfirm="onConfirm"></commentNotice>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import commentNotice from 'base/commentList/commentNotice'
  import { Toast } from 'vant'
  import *as api from 'api/api'
  import http from 'api/http'
  import {formatDate} from 'common/js/date'
  import {mapGetters, mapActions} from 'vuex'
  import BScroll from 'better-scroll'

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
          {name: '生日蛋糕', imgUrl:require('../../../static/images/wish/wish_image_001.jpg'),id: 'wish_image_001.jpg'},
          {name: '冰淇淋', imgUrl:require('../../../static/images/wish/wish_image_002.jpg'),id: 'wish_image_002.jpg'},
          {name: '水晶球', imgUrl:require('../../../static/images/wish/wish_image_003.jpg'),id: 'wish_image_003.jpg'},
          {name: '玫瑰花', imgUrl:require('../../../static/images/wish/wish_image_004.jpg'),id: 'wish_image_004.jpg'},
          {name: '雪人', imgUrl:require('../../../static/images/wish/wish_image_005.jpg'),id: 'wish_image_005.jpg'},
          {name: '钻石戒指', imgUrl:require('../../../static/images/wish/wish_image_006.jpg'),id: 'wish_image_006.jpg'},
          {name: '奖杯', imgUrl:require('../../../static/images/wish/wish_image_007.jpg'),id: 'wish_image_007.jpg'},
          {name: '红酒', imgUrl:require('../../../static/images/wish/wish_image_008.jpg'),id: 'wish_image_008.jpg'},
          {name: '巧克力', imgUrl:require('../../../static/images/wish/wish_image_009.jpg'),id: 'wish_image_009.jpg'},
          {name: '水果篮', imgUrl:require('../../../static/images/wish/wish_image_010.jpg'),id: 'wish_image_010.jpg'},
          {name: '爱心抱枕', imgUrl:require('../../../static/images/wish/wish_image_011.jpg'),id: 'wish_image_011.jpg'},
          {name: '女士包包', imgUrl:require('../../../static/images/wish/wish_image_012.jpg'),id: 'wish_image_012.jpg'},
          {name: '咖啡', imgUrl:require('../../../static/images/wish/wish_image_013.jpg'),id: 'wish_image_013.jpg'},
          {name: '跑车', imgUrl:require('../../../static/images/wish/wish_image_014.jpg'),id: 'wish_image_014.jpg'},
          {name: '单反相机', imgUrl:require('../../../static/images/wish/wish_image_015.jpg'),id: 'wish_image_015.jpg'},
          {name: '抱枕', imgUrl:require('../../../static/images/wish/wish_image_016.jpg'),id: 'wish_image_016.jpg'},
          {name: '阿拉丁神灯', imgUrl:require('../../../static/images/wish/wish_image_017.jpg'),id: 'wish_image_017.jpg'},
          {name: '甜甜圈', imgUrl:require('../../../static/images/wish/wish_image_018.jpg'),id: 'wish_image_018.jpg'},
          {name: '太阳眼镜', imgUrl:require('../../../static/images/wish/wish_image_019.jpg'),id: 'wish_image_019.jpg'},
          {name: '风铃', imgUrl:require('../../../static/images/wish/wish_image_020.jpg'),id: 'wish_image_020.jpg'},
          {name: '旋转木马', imgUrl:require('../../../static/images/wish/wish_image_021.jpg'),id: 'wish_image_021.jpg'},
          {name: '糖果', imgUrl:require('../../../static/images/wish/wish_image_022.jpg'),id: 'wish_image_022.jpg'},
          {name: '盆栽', imgUrl:require('../../../static/images/wish/wish_image_023.jpg'),id: 'wish_image_023.jpg'},
          {name: '香水', imgUrl:require('../../../static/images/wish/wish_image_024.jpg'),id: 'wish_image_024.jpg'},
          {name: '粉红小熊', imgUrl:require('../../../static/images/wish/wish_image_025.jpg'),id: 'wish_image_025.jpg'},
          {name: 'zippo打火机', imgUrl:require('../../../static/images/wish/wish_image_026.jpg'),id: 'wish_image_026.jpg'},
          {name: '两只小熊', imgUrl:require('../../../static/images/wish/wish_image_027.jpg'),id: 'wish_image_027.jpg'},
          {name: '项链', imgUrl:require('../../../static/images/wish/wish_image_028.jpg'),id: 'wish_image_028.jpg'},
        ],
        noticeId: '',
        noticeItem: '',
        noticeWishList: [],
        fetchWishImg: [],
        showCommentList: false,
        wishStatus: '',
        mouseWheel: true,
      }
    },
    created() {
      this.noticeId = this.$route.query.noticeId
      this.saveNoticeId(this.noticeId)
    },
    computed: {
      ...mapGetters([
        'getSessionKey',
      ]),
    },
    mounted(){
      this.getData()
    },
    methods: {
      ...mapActions([
        'saveResponseId', 'saveNoticeId'
      ]),
      async getData() {
        let params = {
          "noticeId": this.noticeId,
        }
        let url = api.serviceUrl + this.getSessionKey
        const birthdayData = await http.post(url, api.serviceBirthday, params)
        if (birthdayData.data.code === api.ERR_OK) {
          let response = birthdayData.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          this.noticeItem = response.noticeData
          this.noticeWishList = response.noticeWishList
          this.noticeWishList.forEach((list) => {
            if (list.wishImage) {
              this.fetchWishImg.push(list.wishImage)
            }
          })

          setTimeout(() => {
            this._initPics()
          }, 20)
        } else {
          Toast({
            duration: 1000,
            message: birthdayData.data.msg
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
      // 删除一级祝福
      async delComment(index, id) {
        this.noticeWishList.splice(index, 1)
        let params = {
          "noticeId": this.noticeId,
          "noticeWishId": id,
        }
        let url = api.serviceUrl + this.getSessionKey
        const delReplyBless = await http.post(url, api.serviceDelBless, params)
        if (delReplyBless.data.code === api.ERR_OK) {
          Toast({
            duration: 1000,
            message: '删除成功'
          })
          this.getData()
        } else {
          Toast({
            duration: 1000,
            message: '删除失败'
          })
        }
      },
      // 回复祝福
      commentOther(index, id) {
        // console.log(id)
        this.saveResponseId(id)
        this.showCommentList = true
      },
      // 删除二级祝福
      async closeComment(index, id) {

        let params = {
          "noticeId": this.noticeId,
          "noticeWishId": id,
        }
        let url = api.serviceUrl + this.getSessionKey
        const closeReplyBless = await http.post(url, api.serviceDelBless, params)
        if (closeReplyBless.data.code === api.ERR_OK) {
          Toast({
            duration: 1000,
            message: '删除成功'
          })
          this.getData()
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
      onConfirm() {
        this.getData()
        this.showCommentList = false
      },
      // 时间格式化
      showDateTime(_date) {
        if (_date) {
          return formatDate(new Date(_date *1000), "yyyy-MM-dd")
        } else {
          return ''
        }
      },
      _initPics() {
        if (this.fetchWishImg.length>0) {
          let picWidth = 85
          let margin = 6
          let width = (picWidth + margin) * this.fetchWishImg.length - margin
          this.$refs.wishList.style.width = width + 'px'
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.giftImg, {
                scrollX: true,
                eventPassthrough: 'vertical'
              });
            } else {
              this.picScroll.refresh()
            }
          })
        }
      },
    },
    components: {
      Scroll,
      commentNotice,
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .wish-detail
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    overflow: hidden
    background: #fff
    z-index: 100
    .detail-container
      position: absolute
      top: 0
      bottom: 0
      left: 0
      right: 0
      overflow: hidden
      background: rgba(7, 17, 27, .05)
      .background
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: -1
        filter: blur(1px) // 滤镜设置为高斯模糊(blur)
        img
          width: 100%
      .head
        width: 100%
        margin: auto
        text-align: center
        padding-bottom: 45px
        // background: rgba(7, 17, 27, .1)
        // text-shadow: 0px 4px 7px #000
        .head-img
          display: flex
          justify-content: center
          align-items: center
          padding-top: 10px
          &>img
            margin: 20px 0 10px
            border: 2px solid #fff
            border-radius: 50%
          .icon
            position: absolute
            transform: rotate(-45deg)
            margin-left: -22px
            margin-top: -22px
            .icon-crown
              font-size: 30px
        .user-name
          padding-bottom: 5px
          .name
            margin-left: 10px
            line-height: 20px
            font-size: 14px
            color: #fff
            // text-shadow: 0px 4px 7px #000
          .icon
            font-size: 12px
            .icon-man
              color: #dcdcdc
            .icon-girl
              font-size: 14px
              font-weight: bold
              color: #ff7f24
        .department
          padding-bottom: 5px
          line-height: 20px
          font-size: 12px
          color: #fff
        .solar-date
          display: flex
          justify-content: center
          align-items: center
          margin-top: 10px
          color: #fff
          font-size: 12px
          padding-bottom: 10px
          .line
            width: 25px
            height: 1px
            background: #fff
          .status, .status-yin
            margin: 0 5px 0 10px
            padding: 3px
            border-radius: 3px
            border: 1px solid #fff
          .user-date
            margin-right: 10px
        .head-other
          padding-bottom: 15px
          line-height: 16px
          font-size: 12px
          color: #fff
      .gift-wrapp
        position: relative
        width: 100%
        height: 105px
        .gift-img
          position: absolute
          height: 85px
          margin: 10px
          width: 95%
          overflow: hidden
          // z-index: 1110
          background: #fff
          border-radius: 5px
          box-shadow: 0 5px 5px rgba(7, 17, 27, .1)
          white-space: nowrap
          .img-ul
            // display: flex
            // flex-flow: row wrap
            // align-content: flex-start
            // width: 100%
            .img-li
              display: inline-block
              margin-right: 6px
              width: 85px
              height: 85px
              img
                width: 80%
              // @media screen and (max-width: 375px)
              //   flex: 0 0 21%
              //   width: 21%
          .empty-wish
            margin: auto
            text-align: center
            line-height: 85px
            font-size: 12px
            color: #999
      .other
        margin: 20px 18px 0 18px
        .other-title
          display: flex
          justify-content: center
          align-items: center
          padding-top: 10px
          margin-bottom: 30px
          color: #333
          .line
            height: 1px
            width: 30px
            background: #333
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
</style>
