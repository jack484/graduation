<template>
  <div class="festival" >
    <div class="festival-wrapp" v-if="festivalInfo">
      <!-- <div class="img-wrapp">
        <div v-for="img in festivalWishImg" alt="" v-if="img.id == festivalInfo.pushImage">
          <img :src="img.imgUrl">
        </div>
      </div> -->
      <div class="push-content">
        <div class="content" v-html="festivalContent"></div>
      </div>
      <!-- 礼物图片 -->
      <div class="gift-wrapp">
        <h1 style="text-align: center; font-size: 14px; color: #666">选礼物 送祝福</h1>
        <div ref="giftImg" class="gift-img">
          <ul class="img-ul">
            <li class="img-li" v-for="(item,index) in wishImg"
              @click="selectImg(index, item.id)"
              :key="item.id"
              :class="{'img-on': isAction === index}">
              <img :src="item.imgUrl">
            </li>
          </ul>
        </div>
      </div>
      <!-- 祝福语输入框 -->
      <div class="textarea">
        <div class="input-reply border-1px">
          <textarea rows="3" placeholder="请输入祝福语..." v-model.trim="inputValue"></textarea>
          <p class="text"><span style="color: #ff7f24; font-size: 13px">{{inputValue.length}}</span> /120</p>
        </div>
      </div>
      <!-- 语音输入 -->
      <!-- <div class="speech-btn">
        <button id="speechBtn"  class="speech" ref="speechBtn"
        @touchstart.stop.prevent="onStartRecord"
        @touchend.stop="onStopRecord"
        :class="{'speech-on': isSpeech}">按住 <span class="icon"><i class="icon-speak"></i></span> 说话</button>
      </div> -->
      <!-- 确认发送祝福 -->
      <div class="confirm-btn border-1px">
        <button class="confirm" @click.stop="confirmReplyBless">发送祝福</button>
      </div>
      <div class="other">
        <div class="other-title">
          <p class="line"></p>
          <span class="text">评论</span> <span class="len"> ({{noticeWishList.length}})</span>
          <p class="line"></p>
        </div>
        <ul class="other-ul" v-if="noticeWishList.length > 0">
          <li class="other-li" v-for="(item, index) in noticeWishList">
            <div class="user-pic">
              <img class="pic" :src="item.avatar" v-if="item.avatar != null && item.avatar">
              <img v-else class="pic" src="./logo.jpg" alt="">
            </div>
            <div class="other-content">
              <div class="reply-user">
                <span class="title">{{item.username}}</span>
                <button class="icon-del"
                @click="delComment(index, item.festivalReplyId)" v-if="item.replyUserId == currentUserId"></button>
                <button v-else class="icon-comment" @click="commentOther(index, item.festivalReplyId)"></button>
              </div>
              <div class="reply-time">
                <p class="time">{{item.replyTime | showTime}}</p>
                <!-- <p class="text">{{item.replyContent}}</p> -->
                <p class="text" v-html="replace_em(item.replyContent)"></p>
              </div>
              <div class="reply-img" v-if="item.replyImage">
                <div style="margin-right: 10px" v-for="img in wishImg" alt="" v-if="img.id == item.replyImage">
                  <img width="50" height="50" :src="img.imgUrl">
                </div>
                <span class="text" v-for="imgName in wishImg" v-if="imgName.id == item.replyImage">{{imgName.name}}</span>
              </div>
              <!-- 回复别人的评论 -->
               <ul class="other-reply" v-if="item.festivalResponseList.length>0">
                <li class="reply-list" v-for="(list, index) in item.festivalResponseList">
                  <div class="reply-avatar">
                    <img :src="list.avatar" v-if="list.avatar != null && list.avatar">
                    <img v-else class="pic" src="./logo.jpg" alt="">
                  </div>
                  <div class="reply-content">
                    <h1 class="title">
                      <span class="reply-user-name">{{list.username}}</span>回复
                      <span class="reply-object">{{list.replyToObject}}</span>
                      <button class="icon-del"
                      v-if="list.replyUserId === currentUserId"
                      @click="closeComment(index, list.festivalResponseId)"></button>
                      <button v-else class="icon-comment" @click="commentOther(index, list.festivalResponseId)"></button>
                    </h1>
                    <p class="_time">{{list.replyTime | showTime}}</p>
                    <!-- <p class="text">{{list.replyContent}}</p> -->
                    <p class="text" v-html="replace_em(list.replyContent)"></p>
                    <div class="reply-img" v-if="list.replyImage">
                      <div v-for="img in replyImage" alt="" v-if="img.id == list.replyImage">
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
          <span class="text">暂无评论，我来发表第一篇评论！</span>
        </div>
      </div>
    </div>
    <div v-else class="empty">
      <div class="empty-img">
        <img src="./empty.jpg" width="140" height="105">
      </div>
      <span class="text">暂无相关数据</span>
    </div>
    <commentFest v-show="showCommentList"
      :festivalId="festivalId"
      @hidComment="hidComment"
      @onConfirm="onConfirm"></commentFest>
  </div>
</template>

<script>
  import *as api from 'api/api'
  import http from 'api/http'
  import {formatDate} from 'common/js/date'
  import { Toast } from 'vant'
  import {getUrlKey} from 'common/js/getSessionKey'
  import {mapActions} from 'vuex'
  import BScroll from 'better-scroll'
  import commentFest from 'base/commentList/commentFest'

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
        festivalWishImg:[
          {name: '除夕', imgUrl:require('../../../static/images/festival/festival_image_cx.jpg'),id: 'festival_image_cx.jpg'},
          {name: '端午节', imgUrl:require('../../../static/images/festival/festival_image_dwj.jpg'),id: 'festival_image_dwj.jpg'},
          {name: '妇女节', imgUrl:require('../../../static/images/festival/festival_image_fnj.jpg'),id: 'festival_image_fnj.jpg'},
          {name: '国庆节', imgUrl:require('../../../static/images/festival/festival_image_gqj.jpg'),id: 'festival_image_gqj.jpg'},
          {name: '节日', imgUrl:require('../../../static/images/festival/festival_image_jr.jpg'),id: 'festival_image_jr.jpg'},
          {name: '劳动节', imgUrl:require('../../../static/images/festival/festival_image_ldj.jpg'),id: 'festival_image_ldj.jpg'},
          {name: '清明节', imgUrl:require('../../../static/images/festival/festival_image_qmj.jpg'),id: 'festival_image_qmj.jpg'},
          {name: '情人节', imgUrl:require('../../../static/images/festival/festival_image_qrj.jpg'),id: 'festival_image_qrj.jpg'},
          {name: '圣诞节', imgUrl:require('../../../static/images/festival/festival_image_sdj.jpg'),id: 'festival_image_sdj.jpg'},
          {name: '元旦', imgUrl:require('../../../static/images/festival/festival_image_yd.jpg'),id: 'festival_image_yd.jpg'},
          {name: '元宵节', imgUrl:require('../../../static/images/festival/festival_image_yxj.jpg'),id: 'festival_image_yxj.jpg'},
          {name: '中秋节', imgUrl:require('../../../static/images/festival/festival_image_zqj.jpg'),id: 'festival_image_zqj.jpg'},
        ],
        currentSessionKey: '',
        festivalId: '',
        festivalInfo: '', // 节日祝福信息
        noticeWishList: [], // 节日祝福的回复
        festivalContent: null,
        inputValue: '',
        isAction: false, // 选中礼物图片添加CSS
        isSpeech: false,
        chooseImgName: '', // 选中的礼物图片
        currentUserId: '', // 当前用户ID
        showCommentList: false,
      }
    },
    created() {
      this.festivalId = getUrlKey('festivalId')
      this.saveFestivalId(this.festivalId)
      this.currentSessionKey = getUrlKey('s')
      // console.log(this.noticeId)
      // console.log(this.currentSessionKey)
      if (this.currentSessionKey != null) {
        this.saveSessionKey(this.currentSessionKey)
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      ...mapActions([
        'saveResponseId', 'saveSessionKey', 'saveFestivalId'
      ]),
      async getData() {
        let params = {
          "festivalId": this.festivalId,
          "sessionKey": this.currentSessionKey,
        }
        let url = api.serviceUrl + this.currentSessionKey
        const festivalData = await http.post(url, api.serviceFestival, params)
        if (festivalData.data.code === api.ERR_OK) {
          let response = festivalData.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          // console.log(response)
          this.festivalInfo = response.caresFestival
          this.festivalContent = this.festivalInfo.pushContent.replace(/\/quany/g, api.imgUrl)
          this.noticeWishList = response.festivalReplyList
          this.currentUserId = response.currentUserId
          this.$nextTick(() => {
            setTimeout(() => {
              this._initScroll()
            }, 20)
          })
        } else {
          Toast({
            duration: 1000,
            message: festivalData.data.msg
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
      // 选中的礼物图片
      selectImg(index, imgname) {
        this.isAction = index
        this.chooseImgName = imgname
      },
      // 发送祝福
      async confirmReplyBless() {
        if (!this.inputValue) {
          Toast('请写点祝福文字吧...')
          return
        }

        let params = {
          "festivalId": this.festivalId,
          "replyContent": this.inputValue,
          "replyImage": this.chooseImgName || '',
          "sessionKey": this.currentSessionKey,
        }
        // console.log(params)
        let url = api.serviceUrl + this.currentSessionKey
        const festReplay = await http.post(url, api.serviceFestivalComment, params)
        // console.log(festReplay)
        if (festReplay.data.code === api.ERR_OK) {
          Toast({
            duration: 1000,
            message: '评论成功'
          })
          this.getData()
        } else {
          Toast({
            duration: 1000,
            message: '评论失败'
          })
        }
      },
      onStartRecord() {
        this.isSpeech = true
      },
      onStopRecord() {
        this.isSpeech = false
      },
      async delComment(index, id) {
        this.noticeWishList.splice(index, 1)
        let params = {
          "festivalId": this.festivalId,
          "festivalReplyId": id,
          "sessionKey": this.currentSessionKey
        }
        let url = api.serviceUrl + this.currentSessionKey
        const delReply = await http.post(url, api.serviceFestDel, params)
        if (delReply.data.code === api.ERR_OK) {
          Toast({
            duration: 1000,
            message: '删除成功'
          })
          // this.getData()
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
      async closeComment(index, id) {
        let params = {
          "festivalId": this.festivalId,
          "festivalReplyId": id,
          "sessionKey": this.currentSessionKey
        }
        let url = api.serviceUrl + this.currentSessionKey
        const delReply = await http.post(url, api.serviceFestDel, params)
        if (delReply.data.code === api.ERR_OK) {
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
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.giftImg, {
            click: true,
            scrollY: true,
            directionLockThreshold: 5,
            mouseWheel: true,
          })
          // console.log(scrollY)
        } else {
          this.scroll.refresh()
        }
      },
    },
    components: {
      commentFest,
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .festival
    position: absolute
    // bottom: 0
    top: 0
    left: 0
    right: 0
    // overflow: hidden
    background: #fcfcfc
    .festival-wrapp
      width: 100%
      .img-wrapp
        background: #fff
        padding-bottom: 10px
        img
          width: 104%
          margin-left: -10px
          border-radius: 0 0 100% 100%/40%
      .push-content
        // padding: 0 18px 10px 18px
        background: #fff
        .content
          img
            width: 100%
      .gift-wrapp
        position: relative
        width: 100%
        height: 190px
        background: #fff
        margin-top: 10px
        padding: 10px 0 10px
        .gift-img
          position: absolute
          height: 161px
          margin: 10px 18px
          overflow: hidden
          // z-index: 1110
          background: #fff
          border-radius: 5px
          // box-shadow: 0 5px 5px rgba(7, 17, 27, .1)
          .img-ul
            display: flex
            flex-flow: row wrap
            align-content: flex-start
            .img-li
              flex: 0 0 22%
              width: 22%
              text-align: center
              padding: 5px 0
              margin: 5px
              border: 1px dashed rgba(7,17,27,0.1)
              border-radius: 8px
              box-sizing: border-box
              img
                width: 80%
              @media screen and (max-width: 375px)
                flex: 0 0 21%
                width: 21%
            .img-on
              border: 1px solid red
              // border-color: red
      .textarea
        margin: 15px 18px 10px 18px
        background: #fff
        border-radius: 5px
        // box-shadow: 0 5px 5px rgba(7, 17, 27, .1)
        .weui-cells
          border-radius: 10px !important
        .input-reply
          // border-1px(rgba(7, 17, 27, .1))
          border: 1px solid rgba(7, 17, 27, .1)
          box-sizing: border-box
          border-radius: 5px
          // background: rgba(7, 17, 27, .1)
          & > textarea
            width: 100%
            padding: 15px
            font-size: 14px
            line-height: 20px
            color: #666
            box-sizing: border-box
            border: none
            resize: none
            outline: none
            // background: rgba(7, 17, 27, .05)
          .text
            text-align: right
            margin: 5px
            font-size: 12px
            color: #999
      .speech-btn
        margin: 10px 18px
        background-color: #fff
        background: #fff
        border-radius: 5px
        // box-shadow: 0 5px 5px rgba(7, 17, 27, .1)
        .speech
          width: 100%
          height: 50px
          background-color: transparent
          outline: none
          border: 1px solid rgba(7, 17, 27, .1)
          font-size: $font-size-medium-x
          color: #ff7f24
          border-radius: 5px
          line-height: 50px
          .icon
            // display: inline-block
            // line-height: 45px
            padding: 10px
            border: 1px solid #ff7f24
            border-radius: 50%
            .icon-speak
              font-size: $font-size-large
        .speech-on
          background: rgba(7, 17, 27, .2)
      .confirm-btn
        margin: 20px 18px
        padding-bottom: 30px
        border-1px(rgba(7, 17, 27, .1))
        .confirm
          width: 100%
          height: 40px
          background-color: #ff7f24
          outline: none
          color: #fff
          font-size: $font-size-medium-x
          border: none
          border-radius: 5px
      .other
        margin: 10px 18px 0 18px
        // padding-bottom: 30px
        .other-title
          display: flex
          justify-content: center
          align-items: center
          margin-bottom: 30px
          .line
            height: 1px
            width: 30px
            background: rgba(7, 17, 27, .1)
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
            padding: 10px 0
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
                  border: none
                  outline: none
                  background: transparent
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
                        color: #999
                        border: none
                        outline: none
                        background: transparent
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
