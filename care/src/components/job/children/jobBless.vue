<template>
  <transition name="router-slid" mode="out-in">
  <div class="bless-wrapp">
  <div ref="scroll" class="blessing-page">
    <div class="blessing-container">
      <div class="head">
        <div class="head-img">
          <img width="50" height="50" :src="noticeItem.avatar" alt="" v-if="noticeItem && noticeItem.avatar != null">
          <img v-else width="50" height="50" src="./logo.jpg" alt="">
        </div>
        <div class="user-name">
          <span class="name">{{noticeItem.username}}</span>
          <span class="icon">
            <i class="icon-man" v-if="noticeItem.gender == 1"></i>
            <i v-else class="icon-girl"></i>
          </span>
        </div>
        <p class="department">{{noticeItem.departmentname}}</p>
        <div class="solar-date">
          <p class="line"></p>
          <!-- <span class="user-date" style="margin-left: 10px;margin-right: 0" id="userDate">{{noticeItem.jobdate | dateTime}}</span> -->
          <span class="status" style="margin-left: 10px;margin-right: 10px;border-radius: 20px;padding: 3px 5px;">{{noticeItem.jobperiod}}</span>
          <p class="line"></p>
        </div>
        <div class="head-other">
          <!-- <span v-if="noticeItem.noticeDate == 0" class="text">今天是Ta的生日，快来送上祝福吧！</span> -->
          <span class="text">Ta的入职<i style="font-size: 14px;color: #fff">{{noticeItem.jobperiod}}</i>，快来送上祝福吧！</span>
        </div>
      </div>
      <div class="background">
        <!-- <img :src="noticeItem.avatar" v-if="noticeItem && noticeItem.avatar != null"> -->
        <img src="../bgTop1.png">
      </div>
      <!-- 礼物图片 -->
      <div class="gift-wrapp">
        <h1 style="text-align: center; font-size: 14px; color: #333">选礼物 送祝福</h1>
        <scroll ref="giftImg" class="gift-img" :data="wishImg">
          <ul class="img-ul">
            <li class="img-li" v-for="(item,index) in wishImg"
              @click="selectImg(index, item.id)"
              :key="item.id"
              :class="{'img-on': isAction === index}">
              <img :src="item.imgUrl">
            </li>
          </ul>
        </scroll>
      </div>
      <!-- 祝福语输入框 -->
      <div class="textarea">
        <div class="input-reply border-1px">
          <textarea rows="3" :placeholder="inputValue" v-model.trim="inputValue"></textarea>
          <p class="text"><span style="color: #ff7f24; font-size: 13px">{{inputValue.length}}</span> /120</p>
        </div>
      </div>
      <!-- 语音输入 -->
      <!-- <div class="speech-btn">
        <button id="speechBtn"  class="speech"
        @touchstart.stop.prevent="onStartRecord"
        @touchend.stop="onStopRecord"
        :class="{'speech-on': isSpeech}">按住 <span class="icon"><i class="icon-speak"></i></span> 说话</button>
      </div> -->
      <!-- 确认发送祝福 -->
      <div class="confirm-btn border-1px">
        <button class="confirm" :disabled="disabled" @click.stop="confirmReplyBless">发送祝福</button>
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
              <img class="pic" :src="item.avatar" v-if="item.avatar && item.avatar != null">
              <img v-else class="pic" src="./logo.jpg" alt="">
            </div>
            <div class="other-content">
              <div class="reply-user">
                <span class="title">{{item.wishUserName}}</span>
                <span class="icon-del"
                v-if="item.wishUserId === currentUserId"
                @click="delComment(index, item.noticeWishId)"></span>
                <span v-else class="icon-comment" @click="commentOther(index, item.noticeWishId)"></span>
              </div>
              <div class="reply-time">
                <p class="time">{{item.wishTime | showTime}}</p>
                <!-- <p class="text">{{item.wishContent}}</p> -->
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
                    <img :src="list.avatar" v-if="list.avatar && list.avatar != null">
                    <img v-else class="pic" src="./logo.jpg" alt="">
                  </div>
                  <div class="reply-content">
                    <h1 class="title">
                      <span class="reply-user-name">{{list.wishUserName}}</span>回复
                      <span class="reply-object">{{list.replyToObject}}</span>
                      <span class="icon-del"
                      v-if="list.wishUserId === currentUserId"
                      @click="closeComment(index, list.wishResponseId)"></span>
                      <span v-else class="icon-comment" @click="commentOther(index, list.wishResponseId)"></span>
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
          <span class="text">暂无评论，我来发表第一篇评论！</span>
        </div>
      </div>
    </div>
    <div class="loading-container" v-show="isShowLoading">
      <loading title='发送中...'></loading>
    </div>
    <commentList v-show="showCommentList"
      :noticeId="noticeId"
      @hidComment="hidComment"
      @onConfirm="onConfirm"></commentList>
  </div>
  </div>
  </transition>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import commentList from 'base/commentList/commentList'
  import { Dialog } from 'vant'
  import { Toast } from 'vant'
  import *as api from 'api/api'
  import http from 'api/http'
  import {formatDate} from 'common/js/date'
  import wx from 'weixin-js-sdk'
  import {mapGetters, mapActions} from 'vuex'
  import Loading from 'base/loading/loading'

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
          {name: '生日蛋糕', imgUrl:require('../../../../static/images/wish/wish_image_001.jpg'),id: 'wish_image_001.jpg'},
          {name: '冰淇淋', imgUrl:require('../../../../static/images/wish/wish_image_002.jpg'),id: 'wish_image_002.jpg'},
          {name: '水晶球', imgUrl:require('../../../../static/images/wish/wish_image_003.jpg'),id: 'wish_image_003.jpg'},
          {name: '玫瑰花', imgUrl:require('../../../../static/images/wish/wish_image_004.jpg'),id: 'wish_image_004.jpg'},
          {name: '雪人', imgUrl:require('../../../../static/images/wish/wish_image_005.jpg'),id: 'wish_image_005.jpg'},
          {name: '钻石戒指', imgUrl:require('../../../../static/images/wish/wish_image_006.jpg'),id: 'wish_image_006.jpg'},
          {name: '奖杯', imgUrl:require('../../../../static/images/wish/wish_image_007.jpg'),id: 'wish_image_007.jpg'},
          {name: '红酒', imgUrl:require('../../../../static/images/wish/wish_image_008.jpg'),id: 'wish_image_008.jpg'},
          {name: '巧克力', imgUrl:require('../../../../static/images/wish/wish_image_009.jpg'),id: 'wish_image_009.jpg'},
          {name: '水果篮', imgUrl:require('../../../../static/images/wish/wish_image_010.jpg'),id: 'wish_image_010.jpg'},
          {name: '爱心抱枕', imgUrl:require('../../../../static/images/wish/wish_image_011.jpg'),id: 'wish_image_011.jpg'},
          {name: '女士包包', imgUrl:require('../../../../static/images/wish/wish_image_012.jpg'),id: 'wish_image_012.jpg'},
          {name: '咖啡', imgUrl:require('../../../../static/images/wish/wish_image_013.jpg'),id: 'wish_image_013.jpg'},
          {name: '跑车', imgUrl:require('../../../../static/images/wish/wish_image_014.jpg'),id: 'wish_image_014.jpg'},
          {name: '单反相机', imgUrl:require('../../../../static/images/wish/wish_image_015.jpg'),id: 'wish_image_015.jpg'},
          {name: '抱枕', imgUrl:require('../../../../static/images/wish/wish_image_016.jpg'),id: 'wish_image_016.jpg'},
          {name: '阿拉丁神灯', imgUrl:require('../../../../static/images/wish/wish_image_017.jpg'),id: 'wish_image_017.jpg'},
          {name: '甜甜圈', imgUrl:require('../../../../static/images/wish/wish_image_018.jpg'),id: 'wish_image_018.jpg'},
          {name: '太阳眼镜', imgUrl:require('../../../../static/images/wish/wish_image_019.jpg'),id: 'wish_image_019.jpg'},
          {name: '风铃', imgUrl:require('../../../../static/images/wish/wish_image_020.jpg'),id: 'wish_image_020.jpg'},
          {name: '旋转木马', imgUrl:require('../../../../static/images/wish/wish_image_021.jpg'),id: 'wish_image_021.jpg'},
          {name: '糖果', imgUrl:require('../../../../static/images/wish/wish_image_022.jpg'),id: 'wish_image_022.jpg'},
          {name: '盆栽', imgUrl:require('../../../../static/images/wish/wish_image_023.jpg'),id: 'wish_image_023.jpg'},
          {name: '香水', imgUrl:require('../../../../static/images/wish/wish_image_024.jpg'),id: 'wish_image_024.jpg'},
          {name: '粉红小熊', imgUrl:require('../../../../static/images/wish/wish_image_025.jpg'),id: 'wish_image_025.jpg'},
          {name: 'zippo打火机', imgUrl:require('../../../../static/images/wish/wish_image_026.jpg'),id: 'wish_image_026.jpg'},
          {name: '两只小熊', imgUrl:require('../../../../static/images/wish/wish_image_027.jpg'),id: 'wish_image_027.jpg'},
          {name: '项链', imgUrl:require('../../../../static/images/wish/wish_image_028.jpg'),id: 'wish_image_028.jpg'},
        ],
        // imgurl: '../../../../static/images/wish/',
        inputValue: '祝您工作蒸蒸日上！',
        showCommentList: false,
        pageNum: 0,
        pageSize: 10,
        noticeId: '', // 员工的ID
        noticeWishList: [], // 大家的祝福
        currentUserId: null, // 当前用户ID
        noticeAvatar: '',
        noticeItem: '', // 寿星信息
        isAction: false, // 选中礼物图片添加CSS
        chooseImgName: '', // 选中的礼物图片
        startTime: null, // 开始录音时间
        localId: null, // 存储录音ID
        sdk: '',
        serverId: null,
        isSpeech: false,
        disabled: false,
        isShowLoading: false,
      }
    },
    created() {
      this.noticeId = this.$route.query.noticeId
      this.noticeItem = this.$route.query.noticeItem
    },
    computed: {
      ...mapGetters([
        'getCurrentUserInfo', 'getSessionKey'
      ]),
    },
    watch: {
    },
    mounted() {
      this.receiveBlessDatas()
      this.fetchCurrentId()
      this.getWxInfo()
    },
    methods: {
      ...mapActions([
        'saveResponseId',
      ]),
      fetchCurrentId() {
        if (this.getCurrentUserInfo) {
          this.currentUserId = this.getCurrentUserInfo.id
        }
      },
      // 获取大家的祝福
      async receiveBlessDatas() {
        let params = {
          "noticeId": this.noticeId,
        }
        let url = api.serviceUrl + this.getSessionKey
        const res = await http.post(url, api.serviceReceiveBless, params)
        if (res.data.code === api.ERR_OK) {
          let response = res.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          this.noticeWishList = response.noticeWishList
        } else {
          Toast({
            duration: 1000,
            message: res.data.msg
          })
        }
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
      // 回复祝福
      commentOther(index, id) {
        this.saveResponseId(id)
        this.showCommentList = !this.showCommentList
      },
      // 删除二级祝福
      async closeComment(index, id) {
        this.noticeWishList.forEach((list) => {
          if (list.caresResponseList.length > 0) {
            list.caresResponseList.splice(index, 1)
          }
        })

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
        } else {
          Toast({
            duration: 1000,
            message: '删除失败'
          })
        }
      },
      // 隐藏回复页
      hidComment() {
        this.showCommentList = false
      },
      onConfirm() {
        this.receiveBlessDatas()
        this.showCommentList = false
      },
      // 选中的礼物图片
      selectImg(index, imgname) {
        this.isAction = index
        this.chooseImgName = imgname
      },
      // 获取微信录音需要的信息
      async getWxInfo() {
        let params = {
          "url": 'http://wx.u-together.cn/cares/',
        }
        let url = api.serviceUrl + this.getSessionKey
        const jssdkData = await http.post(url, api.serviceJssdk, params)
        if (jssdkData.data.code === api.ERR_OK) {
          this.sdk = jssdkData.data.data
          this.wxInit()
        } else {
          Toast({
            duration: 1000,
            message: jssdkData.data.msg
          })
        }
      },
      //微信录音
      wxInit(){
        wx.config({
          debug: false,
          appId: this.sdk.appId, // ID
          timestamp: this.sdk.timestamp, // 生成签名的时间戳
          nonceStr: this.sdk.nonceStr, // 生成签名的随机串
          signature: this.sdk.signature, // 签名
          jsApiList: ['chooseImage',
          'startRecord', // 开始录音
          'playVoice', // 播放录音
          'stopRecord', // 停止录音
          'translateVoice',
          'downloadVoice', // 下载
          'uploadVoice', // 上传录音
          'stopVoice', // 停止播放
          ]
        })
        wx.ready(function () {
          this.onPlayVoice()
        })
        wx.error(function(res){
          // alert("error")
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        })
      },
      // 开始录音
      onStartRecord(e) {
        this.isSpeech = true
        // e.preventDefault()
        // if(!localStorage.rainAllowRecord || localStorage.rainAllowRecord !== 'true'){
          this.startTime = new Date().getTime()
          this.recordTimer = setTimeout(() => {
            wx.startRecord({
              success() {
                // 如果用户未授权录音，则先停止录音进行授权
                // localStorage.rainAllowRecord !== 'true'
                wx.stopRecord()
              },
              cancel() {
                alert('用户拒绝授权录音')
              }
            })
          }, 300)
        // }
        // console.log('开始录音事件')
        // console.log(this.startTime
      },
      // 结束录音
      onStopRecord(e) {
        this.isSpeech = false
        // e.preventDefault()
        let stopTime = new Date().getTime()
        // 当按下和离开间隔时间太短时
        if (stopTime - this.startTime < 300) {
          // 清零开始时间，且不录音
          this.startTime = 0
          clearTimeout(this.recordTimer)
        } else {
          // 松手结束录音
          wx.stopRecord({
            success(res) {
              // console.log(1111111)
              this.localId = res.localId
              // console.log(this.localId)
              this.onUpLoadVoice() // 执行上传事件
            },
            fail(res) {
              // console.log(res)
              alert(JSON.stringify(res))
            }
          })
        }
        // console.log('结束录音事件')
        // console.log(stopTime)
        console.log(this.localId)
      },
      // 上传录音
      onUpLoadVoice() {
        // console.log('onUpLoadVoice')
        wx.uploadVoice({
          // 需要上传的音频的本地ID，由stopRecord接口获得
          localId: this.localId,
          // 默认为1，显示进度提示
          isShowProgressTips: 1,
          success(res) {
            // 返回音频的服务器端ID
            console.log(res.serverId)
            this.serverId = res.serverId
          }
        })
        // alert(this.serverId)
      },
      // 播放音频
      onPlayVoice() {
        if (this.localId == '') {
          Toast('请先使用 startRecord 接口录制一段声音')
          return
        }
        wx.playVoice({
          localId: this.localId
        })
      },
      // 发送祝福
      async confirmReplyBless() {
        if (!this.inputValue) {
          Toast({
            duration: 1000,
            message: '请写点祝福文字吧...'
          })
          return
        }
        this.isShowLoading = true
        let params = {
          "noticeId": this.noticeId,
          "wishContent": this.inputValue,
          "wishImage": this.chooseImgName || '',
          "wxAudio": '',
        }
        this.disabled = !this.disabled
        let url = api.serviceUrl + this.getSessionKey
        const replayBless = await http.post(url, api.serviceSetBless, params)
        if (replayBless.data.code === api.ERR_OK) {
          Toast({
            duration: 1000,
            message: '发送成功'
          })
          this.isShowLoading = false
          setTimeout(() => {
            this.disabled = false
          }, 5000)
          this.receiveBlessDatas()
        } else {
          Toast({
            duration: 1000,
            message: '发送失败'
          })
          this.disabled = false
          this.isShowLoading = false
        }
      },
    },
    components: {
      Scroll,
      commentList,
      Loading,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

.bless-wrapp
  position: absolute
  top: 0
  left: 0
  right: 0
  z-index: 110
  background-color: #fff
  .blessing-page
    position: absolute
    top: 0
    // bottom: 0
    left: 0
    right: 0
    // overflow: hidden
    background-color: #fff
    z-index: 111
    .blessing-container
      width: 100%
      background: rgba(7, 17, 27, .05)
      .background
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: -1
        filter: blur(1px) // 滤镜设置为高斯模糊(blur)
        // background: linear-gradient(to bottom, #ccc, white)
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
            font-size: 10px
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
        height: 182px
        // background: linear-gradient(to bottom, rgba(7, 17, 27, .1), #eee)
        .gift-img
          position: absolute
          height: 161px
          margin: 10px 18px
          overflow: hidden
          // z-index: 1110
          background: #fff
          border-radius: 5px
          box-shadow: 0 5px 5px rgba(7, 17, 27, .1)
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
        box-shadow: 0 5px 5px rgba(7, 17, 27, .1)
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
        box-shadow: 0 5px 5px rgba(7, 17, 27, .1)
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
    .loading-container
      position: absolute
      bottom: 0
      top: 0
      left: 0
      right: 0
      overflow: hidden
      background: rgba(7, 17, 27, .8)
      z-index: 1111
      .loading
        margin-top: 100%
        color: #fff !important
        &>p
          color: #fff !important
  .router-slid-enter-active, .router-slid-leave-active
    transition: all 0.3s
  .router-slid-enter, .router-slid-leave-active
    transform: translate3d(30px, 0, 0)
    opacity: 0
</style>
