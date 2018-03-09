<template>
  <div class="animation-page">
    <div class="bg" :class="{'bg-on': isAnimate}"></div>
    <div class="bg1" :class="{'bg1-on': isAnimateL}"></div>
    <span class="icon" :class="{'music-play': isMusic}">
      <i class="icon-music"></i>
    </span>
    <div class="clock" :class="{'clock-on': isAnimateL}"></div>
    <div class="clock-line"></div>
    <div class="staff" :class="{'staff-on': isAnimateL}"></div>
    <div class="staff-y" :class="{'staff-y-on': isAnimateL}"></div>
    <div class="iphone" :class="{'iphone-on': isAnimate}"></div>
    <div class="iphone-y" :class="{'iphone-y-on': isAnimateL}"></div>
    <div class="teacup" :class="{'teacup-on': isAnimate}"></div>
    <div class="teacup-y" :class="{'teacup-y-on': isAnimateL}"></div>
    <div class="openlight" :class="{'openlight-on': isAnimateL}"></div>
    <div class="light" :class="{'light-on': isAnimateL}"></div>
    <div class="balloon" :class="{'balloon-on': isAnimateL}"></div>
    <div v-if="currentUserInfo.id==birthdayId" @click="goToWishDetail" class="notice-btn" :class="{'notice-on': isAnimateL}"></div>
    <div class="confirm" v-else @click="goTojobBless">
      <span class="text" v-show="showWishBtn" >去送祝福</span>
    </div>
    <div class="words" v-if="currentUserInfo.id==birthdayId">
      <header class="title" :class="{'title-on': isAnimateL}">
        <img :src="avatar" width="40" height="40">
        <span class="name">亲爱的 {{userName}}</span>
      </header>
      <p class="text" :class="{'text-on': isAnimateL}">今天您入职全友家私有限公司满 {{jobPeriod}}，{{longevityContent}}</p>
    </div>
    <div class="words" v-else>
      <header class="title" :class="{'title-on': isAnimateL}">
        <img :src="currentUserInfo.avatar" width="40" height="40">
        <span class="name">亲爱的 {{currentUserInfo.name}}</span>
      </header>
      <p class="text" :class="{'text-on': isAnimateL}">今天是您同事
        <span style="font-size: 18px;font-weight: bold;color: #fff"> {{userName}} </span>
        入职{{jobPeriod}}纪念日，快去送上祝福吧！
      </p>
    </div>
    <audio id="audio" src="static/images/music.mp3" autoplay loop></audio>
  </div>
</template>

<script>
  import *as api from 'api/api'
  import http from 'api/http'
  import {formatDate} from 'common/js/date'
  import { Toast } from 'vant'
  import {getUrlKey} from 'common/js/getSessionKey'
  import {mapActions} from 'vuex'

  export default {
    data() {
      return {
        isAnimate: false,
        isMusic: false,
        showWishBtn: false,
        userName: '',
        noticeId: '',
        currentSessionKey: '',
        avatar: null,
        longevityContent: '',
        isAnimateL: false,
        jobPeriod: '',
        wishStatus: 'job',
        currentUserInfo: '',
        currentUserId: '',
        birthdayId: '',
        noticeItem: '',
      }
    },
    beforeDestroy(){ // 销毁定时器
      clearTimeout(this.timer)
      clearTimeout(this._timer)
    },
    created() {
      this.noticeId = getUrlKey('noticeId')
      this.currentSessionKey = getUrlKey('s')
      if (this.currentSessionKey != null) {
        this.saveSessionKey(this.currentSessionKey)
      }
    },
    mounted() {
      this.isMusic = true
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        this.showAnimate()
      }, 300)
      this.v_time = setTimeout(() => {
        this.showWishBtn = true
      }, 7000)
      this.getData()
      this.fetchCurUserInfo()
    },
    methods: {
      ...mapActions([
        'saveWishList', 'saveSessionKey', 'saveUserInfo'
      ]),
      showAnimate() {
        this.isAnimate = true
        setTimeout(() => {
          this.isAnimate = false
          this.isAnimateL = true
        }, 2000)
      },
      async getData() {
        let params = {
          "noticeId": this.noticeId,
        }
        let url = api.serviceUrl + this.currentSessionKey
        const birthdayData = await http.post(url, api.serviceBirthday, params)
        if (birthdayData.data.code === api.ERR_OK) {
          let response = birthdayData.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          this.noticeItem = response.noticeData
          this.userName = response.noticeData.userName
          this.avatar = response.noticeData.avatar
          this.longevityContent = response.noticeData.caresRule.longevityContent
          this.jobPeriod = response.noticeData.jobPeriod
          this.birthdayId = response.noticeData.userId
          if (response.noticeWishList.length > 0) {
            this.saveWishList(response.noticeWishList)
          }
          // console.log(this.noticeItem)
          // this.saveUserInfo(response.noticeData)
        } else {
          Toast({
            duration: 1000,
            message: birthdayData.data.msg
          })
        }
      },
      async fetchCurUserInfo() {
        let params = {
          "sessionKey": this.currentSessionKey,
        }
        let url = api.serviceUrl + this.currentSessionKey
        const res = await http.post(url, api.serviceMe, params)
        if (res.data.code === api.ERR_OK) {
          let response = res.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          this.currentUserInfo = response.currentUser
          this.currentUserId = response.currentUser.id
          // console.log(this.currentUserInfo)
        }
      },
      goToWishDetail() {
        this.$router.push({path:'/staffWish', query: {noticeId: this.noticeId}})
      },
      goTojobBless() {
        this.$router.push({path:'/jobBless', query: {noticeId: this.noticeId,noticeItem: this.noticeItem, currentUserId: this.currentUserId}})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @keyframes music_disc
    0%
      transform: rotate(0deg)
    100%
      transform: rotate(360deg)
  @keyframes tipMove
    0%
      transform: scale(1)
    25%
      transform: scale(.8)
    45%
      transform: scale(1.1)
    65%
      transform: scale(.8)
    85%
      transform: scale(1.1)
    100%
      transform: scale(1)

  .animation-page
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    overflow: hidden
    .router-slid-enter-active, .router-slid-leave-active
      transition: all .3s
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(30px, 0, 0)
      opacity: 0
    .bg
      position: absolute
      top: 0
      bottom: 0
      left: 0
      right: 0
      background: url(../../../static/images/staffs/bg1.jpg) no-repeat center center
      background-size: 100% 100%
      transition: all 1s 2s
      opacity: 1
    .bg-on
      opacity: 0
    .bg1
      position: absolute
      top: 0
      bottom: 0
      left: 0
      right: 0
      background: url(../../../static/images/staffs/2.jpg) no-repeat center center
      background-size: 100% 100%
      transition: all 1s 2s
      opacity: 0
    .bg1-on
      opacity: 1
    .icon
      position: absolute
      top: 5%
      right: 5%
      padding: 5px
      font-size: 30px
      color: #fff
    .music-play
      animation: music_disc 4s linear infinite
    .clock
      position: absolute
      width: 50px
      height: 50px
      top: 10%
      left: 5%
      background: url(../../../static/images/staffs/clock1.png) no-repeat center center
      background-size: 100% 100%
      opacity: 1
      transition: all 1s 2s
    .clock-on
      top: 10%
      left: 5%
    .clock-line
      position: absolute
      width: 10px
      height: 10px
      top: 12.5%
      left: 11.8%
      background: url(../../../static/images/staffs/clock_line.png) no-repeat center center
      background-size: 100% 100%
      opacity: 1
      // animation: music_disc 3s linear infinite
    .staff
      position: absolute
      width: 100%
      height: 100%
      margin-top: 0
      background: url(../../../static/images/staffs/staff_y.png) no-repeat center center
      background-size: 100% 100%
      transition: all 1s 2s
      opacity: 1
    .staff-on
      opacity: 0
    .iphone
      position: absolute
      width: 100%
      height: 100%
      margin-top: -85px
      background: url(../../../static/images/staffs/iphone.png) no-repeat center center
      background-size: 100% 100%
      transition: all 1s 1s
      opacity: 0
    .iphone-on
      margin-top: -65px
      opacity: 1
    .teacup
      position: absolute
      width: 100%
      height: 100%
      margin-top: -90px
      background: url(../../../static/images/staffs/teacup.png) no-repeat center center
      background-size: 100% 100%
      transition: all 1s 1s
      opacity: 0
    .teacup-on
      margin-top: -70px
      opacity: 1
    .openlight
      position: absolute
      width: 100%
      height: 100%
      margin-top: -85px
      background: url(../../../static/images/staffs/openlight.png) no-repeat center center
      background-size: 100% 100%
      transition: all 2s 2s
      opacity: 1
    .openlight-on
      opacity: 0
    .light
      position: absolute
      width: 100%
      height: 100%
      margin-top: 0
      background: url(../../../static/images/staffs/light.png) no-repeat center center
      background-size: 100% 100%
      transition: all 2s 2s
      opacity: 0
    .light-on
      opacity: 1
    .staff-y
      position: absolute
      width: 100%
      height: 100%
      margin-top: 0
      background: url(../../../static/images/staffs/staff_w.png) no-repeat center center
      background-size: 100% 100%
      transition: all 1s 2s
      opacity: 0
    .staff-y-on
      opacity: 1
    .iphone-y
      position: absolute
      width: 100%
      height: 100%
      margin-top: 0
      background: url(../../../static/images/staffs/iphone.png) no-repeat center center
      background-size: 100% 100%
      transition: all 1s 2s
      opacity: 0
    .iphone-y-on
      opacity: 1
    .teacup-y
      position: absolute
      width: 100%
      height: 100%
      margin-top: 0
      background: url(../../../static/images/staffs/teacup.png) no-repeat center center
      background-size: 100% 100%
      transition: all 1s 2s
      opacity: 0
    .teacup-y-on
      opacity: 1
    .balloon
      position: absolute
      width: 100%
      height: 100%
      margin-top: -75px
      background: url(../../../static/images/staffs/balloon.png) no-repeat center center
      background-size: 100% 100%
      transition: all 1s 2.5s
      opacity: 0
    .balloon-on
      margin-top: -55px
      opacity: 1
    .notice-btn
      position: absolute
      width: 100%
      height: 100%
      margin-top: -45px
      left: 80%
      background: url(../../../static/images/staffs/notice_btn.png) no-repeat center center
      background-size: 100% 100%
      transition: all 1s 4s
      opacity: 0
      z-index: 20
    .notice-on
      left: 0
      opacity: 1
    .words
      // bottom: 35%
      // left: 15%
      .title
        position: absolute
        top: 14%
        left: 80%
        font-size: 16px
        font-weight: bold
        color: #fff
        transition: all 2s 2.5s
        opacity: 0
        display: flex
        align-items: center
        & > img
          margin-right: 10px
          border-radius: 50%
        .head-icon
          position: absolute
          transform: rotate(-45deg)
          font-size: 26px
          margin-top: -10px
          margin-left: -10px
        .name
          margin-top: 5px
      .text
        position: absolute
        top: 26%
        left: 80%
        width: 60%
        line-height: 20px
        font-size: 14px
        color: #fff
        transition: all 2s 3s
        opacity: 0
      .title-on, .text-on
        left: 28%
        opacity: 1
    .confirm
      position: absolute
      top: 40%
      width: 100%
      text-align: center
      height: 40px
      .text
        width: 40%
        display: inline-block
        line-height: 35px
        background: #F4A460
        font-size: 16px
        color: #fff
        border-radius: 5px
        box-shadow: 0 5px 5px rgba(7, 17, 27, .1)
        animation: tipMove .5s
</style>
