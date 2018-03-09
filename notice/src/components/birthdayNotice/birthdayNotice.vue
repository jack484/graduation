<template>
  <div class="animation-page" @click="showAnimate">
    <span class="icon" :class="{'music-play': isMusic}">
      <i class="icon-music"></i>
    </span>
    <img class="girl" src="static/images/birthday/girl.png" :class="{'girl-on': isAnimate}">
    <div class="balloon" :class="{'balloon-on': isAnimate}"></div>
    <div class="envelope" :class="{'envelope-on': isAnimate}"></div>
    <div class="wirting-paper" :class="{'wirting-paper-on': isAnimate}"></div>
    <div class="btn" v-if="currentUserInfo.id==birthdayId">
      <div class="wish-btn" v-show="showWishBtn" @click="goToWishDetail"></div>
    </div>
    <div class="confirm" v-else>
      <span class="text" v-show="showWishBtn" @click="goToWishDetail">去送祝福</span>
    </div>
    <div class="words">
      <header class="title" :class="{'title-on': isAnimate}" v-if="currentUserInfo.id==birthdayId">
        <img :src="avatar" width="40" height="40">
        <span class="head-icon" v-if="currentUserInfo.id==birthdayId"><i class="icon-crown"></i></span>
        <span class="name" >亲爱的 {{userName}}</span>
      </header>
      <header class="title" :class="{'title-on': isAnimate}" v-else>
        <img :src="currentUserInfo.avatar" width="40" height="40">
        <span class="head-icon" v-if="currentUserInfo.id==birthdayId"><i class="icon-crown"></i></span>
        <span class="name" >亲爱的 {{currentUserInfo.name}}</span>
      </header>
      <p class="text" :class="{'text-on': isAnimate}" v-if="currentUserInfo.id==birthdayId">{{longevityContent}}</p>
      <div class="swsw" v-else>
        <p class="text" :class="{'text-on': isAnimate}" v-if="noticeDate==0">今天是您好友 <span style="font-size: 18px;font-weight: bold;color: #EE3B3B">{{userName}} </span>的生日，快去送上祝福吧！</p>
        <p class="text" :class="{'text-on': isAnimate}" v-else>再过{{noticeDate}}天就是您好友 <span style="font-size: 18px;font-weight: bold;color: #EE3B3B">{{userName}} </span>的生日啦，快去送上祝福吧！</p>
      </div>
    </div>
    <audio id="audio" src="static/images/birthday.mp3" autoplay loop></audio>
    <transition name="router-slid" mode="out-in">
      <router-view/>
    </transition>
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
        wishStatus: 'birthday',
        currentUserInfo: '',
        birthdayId: '', // 生日者的ID
        birthdayTime: null, // 生日距离日期
        noticeYear: null, // 推送年份
        _noticetime: null, // 农历生日距离时间
        noticeDate: null, // 阳历生日距离时间
        noticeItem: '',
        currentUserId: '',
        statusDate: null,
      }
    },
    beforeDestroy(){ // 销毁定时器
      clearTimeout(this.timer)
      clearTimeout(this._timer)
    },
    created() {
      this.noticeId = getUrlKey('noticeId')
      this.currentSessionKey = getUrlKey('s')
      // console.log(this.noticeId)
      // console.log(this.currentSessionKey)
      if (this.currentSessionKey != null) {
        this.saveSessionKey(this.currentSessionKey)
      }
    },
    mounted() {
      this.isMusic = true
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        this.showAnimate()
      }, 800)
      this._timer = setTimeout(() => {
        clearTimeout(this._timer)
        this.showWishBtn = true
      }, 5000)
      this.getData()
      this.fetchCurUserInfo()
    },
    methods: {
      ...mapActions([
        'saveWishList', 'saveSessionKey', 'saveUserInfo'
      ]),
      showAnimate() {
        this.isAnimate = true
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
          // console.log(response)
          this.noticeItem = response.noticeData
          this.userName = response.noticeData.userName
          this.avatar = response.noticeData.avatar
          this.longevityContent = response.noticeData.caresRule.longevityContent
          this.birthdayId = response.noticeData.userId
          this.noticeYear = response.noticeData.noticeYear
          // console.log(this.birthdayId)
          if (response.noticeData.noticeTime) {
            // 阴历剩余天数
            let v_noticetime  = this.showDateTime(response.noticeData.noticeTime)
            let l_getMonth = v_noticetime.substr(5, 2)
            let l_getDay = v_noticetime.substr(-2)
            this._noticetime = this.getDateTime(l_getMonth, l_getDay)

            // 阳历剩余天数
            let v_date = this.showDateTime(response.noticeData.solarDate)
            let _getMonth = v_date.substr(5, 2)
            let _getDate = v_date.substr(-2)
            this.noticeDate = this.getDateTime(_getMonth, _getDate)
          }
          // 计算生日已过的员工信息， 如果通知日期减去当前日期<0，则该员工生日已过
          let timer = this.showDateTime(response.noticeData.noticeTime)
          let endDay = new Date(timer)
          let nowDay = new Date()
          if ((endDay.getTime()+86400000) - nowDay.getTime() < 0) {
            this.statusDate = 1
          } else {
            this.statusDate = 0
          }
          this.saveWishList(response.noticeWishList)
          this.saveUserInfo(response.noticeData)
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
          // console.log(this.currentUserId)
        }
      },
      // 时间格式化
      showDateTime(_date) {
        if (_date) {
          return formatDate(new Date(_date *1000), "yyyy-MM-dd")
        } else {
          return ''
        }
      },
      // 倒计天数
      getDateTime(v_getMonth, v_getDate) {
        let _noticeDate = ''
        if (v_getMonth) {
          let _day = Number(v_getDate)+1
          let _time = this.noticeYear + '/' + v_getMonth +'/'+ _day
          let endTime = new Date(_time)
          let nowTime = new Date()
          let t = endTime.getTime() - nowTime.getTime()
          if (t>=0) {
            _noticeDate = Math.floor(t/1000/60/60/24)
          }
          if (t<0) {
            let _time = (this.noticeYear+1) +'/'+ v_getMonth +'/'+ v_getDate
            let endTime = new Date(_time)
            let nowTime = new Date()
            let t = endTime.getTime() - nowTime.getTime()
            _noticeDate = Math.floor(t/1000/60/60/24)
          }
          return _noticeDate
        }
      },
      goToWishDetail() {
        if (this.currentUserInfo.id == this.birthdayId) {
          this.$router.push({path:'/wishDetail', query: {noticeId: this.noticeId}})
        } else {
          this.$router.push({path:'/birthdayBless', query: {noticeId: this.noticeId, noticeItem: this.noticeItem, currentUserId: this.currentUserId, statusDate: this.statusDate, noticeDate: this.noticeDate}})
        }
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
    background: url(../../../static/images/birthday/bg.png) no-repeat center center
    background-size: 100% 100%
    .girl
      position: absolute
      width: 100%
      margin-top: -81px
      transition: all 2s
      opacity: 0
    .girl-on
      margin-top: -16px
      opacity: 1
    .balloon
      position: absolute
      width: 100%
      height: 100%
      margin-top: 150px
      background: url(../../../static/images/birthday/balloon.png) no-repeat center center
      background-size: 100% 100%
      transition: all 2s 1s
      opacity: 0
    .balloon-on
      margin-top: -30px
      opacity: 1
    .envelope
      position: absolute
      width: 100%
      height: 100%
      margin-top: 170px
      background: url(../../../static/images/birthday/envelope.png) no-repeat center center
      background-size: 100% 100%
      transition: all 2s 1.5s
      opacity: 0
    .envelope-on
      margin-top: -3px
      opacity: 1
    .wirting-paper
      position: absolute
      width: 100%
      height: 100%
      margin-top: 170px
      background: url(../../../static/images/birthday/wirting_paper.png) no-repeat center center
      background-size: 100% 100%
      transition: all 2s 2s
      opacity: 0
    .wirting-paper-on
      margin-top: 12px
      opacity: 1
    .words
      // bottom: 35%
      // left: 15%
      .title
        position: absolute
        bottom: 40%
        left: 80%
        font-size: 16px
        font-weight: bold
        color: #000
        transition: all 2s 2.5s
        opacity: 0
        display: flex
        align-items: center
        & > img
          margin-right: 10px
          border-radius: 50%
          border: 1px solid #fff
          box-sizing: border-box
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
        bottom: 26%
        left: 80%
        width: 60%
        line-height: 20px
        font-size: 14px
        color: #333
        transition: all 2s 3s
        opacity: 0
      .other
        position: absolute
        bottom: 30%
        left: 80%
        font-size: 14px
        color: #333
        transition: all 2s 3.5s
        opacity: 0
      .title-on, .text-on, .other-on
        left: 15%
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
    .wish-btn
      position: absolute
      width: 100%
      height: 100%
      margin-top: 60%
      background: url(../../../static/images/birthday/wish_btn1.png) no-repeat center center
      background-size: 100% 100%
      animation: tipMove .5s
    .confirm
      position: absolute
      bottom: 10%
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
    .router-slid-enter-active, .router-slid-leave-active
      transition: all .3s
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(30px, 0, 0)
      opacity: 0
</style>
