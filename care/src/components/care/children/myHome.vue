<template>
  <div class="my-home">
    <div>
      <div class="background">
        <!-- <img :src="currentUserInfo.avatar" v-if="currentUserInfo.avatar">
        <img v-else src="./logo.jpg"> -->
        <img src="../bgTop1.png">
      </div>
      <div class="head">
        <div class="head-img">
          <span class="icon-crown" v-if="closingDate==0"></span>
          <img :src="currentUserInfo.avatar" v-if="currentUserInfo.avatar">
          <img v-else src="./logo.jpg">
        </div>
        <div class="head-user">
          <span class="text">{{currentUserInfo.name}}</span>
          <span class="icon">
            <i class="icon-man" v-if="currentUserInfo.gender == 1"></i>
            <i v-else class="icon-girl"></i>
          </span>
        </div>
      </div>
      <div class="redact-info">
        <div class="info-wrapp">
        <router-link  tag="div" :to="{path:'./setInfo', query: {index: 0, birthdayType: currentUserInfo.birthdayType}}" class="birthday-info">
          <span class="info-icon">
            <i class="icon-birthday"></i>
          </span>
          <div class="info-content">
            <div class="info-text" v-if="!!currentUserInfo">
              <div class="show-title">
                <span class="status" v-if="currentUserInfo.birthdayType == 0">阳</span>
                <span class="status-yin" v-else>阴</span>
                <span class="user-date" id="userDate" v-if="currentUserInfo.birthdayType == 0">{{currentUserInfo.birthDay | showTime}}</span>
                <span v-else class="user-date" id="userDate">{{lunarDate}}</span>
              </div>
              <span class="now-date" v-if="noticeBirthDay==0">今天是您的生日！生日快乐！</span>
              <span class="text" v-else>距离您的生日还有 <i>{{noticeBirthDay}}</i> 天</span>
            </div>
            <div v-else class="info-text">
              <span class="title">暂无生日信息</span>
              <span class="text">请先完善您的生日</span>
            </div>
            <span class="icon"><i class="icon-right"></i></span>
          </div>
        </router-link>
        <router-link  tag="div" :to="{path:'./setInfo', query: {index: 1}}" class="company-info">
          <span class="info-icon">
            <i class="icon-entry_company"></i>
          </span>
          <div class="info-content">
            <div class="info-text" v-if="!!currentUserInfo.employmentDate">
              <span class="title">{{currentUserInfo.employmentDate | _dateTime}}入职<span class="desc">{{currentYear}} 周年</span></span>
              <span class="text">您已进入公司 <i>{{currentYear}}</i> 周年啦！</span>
            </div>
            <div v-else class="info-text">
              <span class="title">暂无入职信息</span>
              <span class="text">请先完善您的入职日期</span>
            </div>
            <span class="icon"><i class="icon-right"></i></span>
          </div>
        </router-link>
        </div>
      </div>
      <!-- <div class="sun-nav">
        <div class="content">
          <div class="sun-text border-1px">
            <span class="sun">我的阳光值</span>
            <div class="right-info" @click="goTransition">
              <span class="text">敬请期待</span>
              <span class="icon-right"></span>
            </div>
          </div>
          <div class="sun-text border-1px">
            <span class="sun">阳光值排行榜</span>
            <div class="right-info">
              <span class="text">敬请期待</span>
              <span class="icon-right"></span>
            </div>
          </div>
        </div>
      </div> -->
      <div class="other">
        <div class="content">
          <div class="other-text border-1px" @click="goWishPage('SVCQY10011')">
            <span class="text">收到的祝福</span>
            <span class="icon-right"></span>
          </div>
          <div class="other-text border-1px" @click="goWishPage('SVCQY10012')">
            <span class="text">回复我的</span>
            <span class="icon-right"></span>
          </div>
          <!-- <div class="other-text border-1px" @click="goSeacrh()">
            <span class="text">滚动事件</span>
            <span class="icon-right"></span>
          </div> -->
        </div>
      </div>
    </div>
    <transition name="router-slid" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import { Toast } from 'vant'
  import *as api from 'api/api'
  import http from 'api/http'
  import {mapGetters, mapActions} from 'vuex'
  import {formatDate, dateFilters} from 'common/js/date'

  export default {
    filters: {
      // 时间格式化过滤器
      showTime(_date) {
        if (_date) {
          return formatDate(new Date(_date *1000), "MM月dd日")
        } else {
          return ''
        }
      },
      _dateTime(_date) {
        if (_date) {
          return formatDate(new Date(_date *1000), "yyyy年")
        } else {
          return ''
        }
      },
    },
    data() {
      return {
        lMonth: [
         {num: '01', name: '正月'},
         {num: '02', name: '二月'},{num: '03', name: '三月'},{num: '04', name: '四月'},{num: '05', name: '五月'},{num: '06', name: '六月'},{num: '07', name: '七月'},{num: '08', name: '八月'},{num: '09', name: '九月'},{num: '10', name: '十月'},{num: '11', name: '冬月'},{num: '12', name: '腊月'},
        ],
        lDay: [
         {num: '01', name: '初一'},
         {num: '02', name: '初二'},{num: '03', name: '初三'},{num: '04', name: '初四'},{num: '05', name: '初五'},{num: '06', name: '初六'},{num: '07', name: '初七'},{num: '08', name: '初八'},{num: '09', name: '初九'},{num: '10', name: '初十'},{num: '11', name: '十一'},{num: '12', name: '十二'},{num: '13', name: '十三'},{num: '14', name: '十四'},{num: '15', name: '十五'},{num: '16', name: '十六'},{num: '17', name: '十七'},{num: '18', name: '十八'},{num: '19', name: '十九'},{num: '20', name: '二十'},{num: '21', name: '廿一'},{num: '22', name: '廿二'},{num: '23', name: '廿三'},{num: '24', name: '廿四'},{num: '25', name: '廿五'},{num: '26', name: '廿六'},{num: '27', name: '廿七'},{num: '28', name: '廿八'},{num: '29', name: '廿九'},{num: '30', name: '三十'},
        ],
        userBirthday: '', // 用户生日
        statusDate: '', // 生日状态
        statusStr: '', // 阳历还是阴历
        getMonth: '', // 生日月份
        getDate: '', // 生日日期
        closingDate: null, // 距离你的生日还有几天
        entrDate: null, // 入职日期
        currentUserInfo: '', // 当前用户信息
        _getMonth: '', // 生日月份
        _getDate: '', // 生日日期
        noticeBirthDay: null, // 距离生日还有几天
        noticeEmploymentDate: null, // 距离入职周年还有几天
        currentYear: null, // 当前年分
        lunarDate: '', // 显示阴历生日
      }
    },
    computed: {
      ...mapGetters([
        'getUserSetInfo', 'getUserEntrInfo', 'getSessionKey'
      ])
    },
    watch: {
      getUserSetInfo: function(value) {
        this.statusDate = value[0]
        if (this.statusDate == '阳历') {
          this.userBirthday = value[1]
        } else {
          this.userBirthday = value[2]
        }
        this.statusStr = this.statusDate.substr(0, 1)
        this.getMonth = this.userBirthday.substr(5, 2)
        this.getDate = this.userBirthday.substr(-2)
        // this.getDateTime()
      },
      getUserEntrInfo: function(nowInfo) {
        if (this.getUserEntrInfo) {
          this.entrDate = nowInfo
        }
      }
    },
    mounted() {
      this.fetchUserInfo()
      this.getEntrInfo()
      this.getData()
    },
    methods: {
      async getData() {
        let params = {
          "sessionKey": this.getSessionKey,
        }
        let url = api.serviceUrl + this.getSessionKey
        const res = await http.post(url, api.serviceMe, params)
        if (res.data.code === api.ERR_OK) {
          let response = res.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)

          this.currentUserInfo = response.currentUser
          let v_date = this.showDateTime(response.currentBirthday)
          let y_date = this.showDateTime(this.currentUserInfo.employmentDate)

          let _year = dateFilters(new Date())
          if (v_date) {
            this._getMonth = v_date.substr(5, 2)
            this._getDate = v_date.substr(-2)
          }

          let y_getMonth = ''
          let y_getDate = ''
          let y_year = ''
          let now_year = ''
          if (y_date) {
            y_getMonth = y_date.substr(5, 2)
            y_getDate = y_date.substr(-2)
            y_year = y_date.substr(0, 4)
          }
          if (_year) {
            now_year = _year.substr(0, 4)
          }
          this.currentYear = now_year - y_year
          this.noticeBirthDay = this.getDateTime(this._getMonth, this._getDate)
          this.noticeEmploymentDate = this.getDateTime(y_getMonth, y_getDate)
          let _month = ''
          let _day = ''
          if (this.currentUserInfo.lunarBirthDay) {
            _month = this.currentUserInfo.lunarBirthDay.substring(0, 2)
            _day = this.currentUserInfo.lunarBirthDay.substring(2)
          }
          let l_month = ''
          let l_day = ''
          this.lMonth.forEach((list) => {
            if (list.num == _month) {
              l_month = list.name
            }
          })
          this.lDay.forEach((item) => {
            if (item.num == _day) {
              l_day = item.name
            }
          })
          this.lunarDate = l_month + l_day
        } else {
          Toast({
            duration: 1000,
            message: res.data.msg
          })
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
        let nowYear = dateFilters(new Date())
        let _nowYear = ''
        if (nowYear) {
          _nowYear = nowYear.substr(0, 4)
        }
        // console.log(Number(_nowYear)+1)
        let _noticeDate = ''
        if (v_getMonth) {
          let _day = Number(v_getDate)+1
          let _time = _nowYear +'/'+ v_getMonth +'/'+ _day
          let endTime = new Date(_time)
          let nowTime = new Date()
          let t = endTime.getTime() - nowTime.getTime()
          if (t>=0) {
            _noticeDate = Math.floor(t/1000/60/60/24)
          }
          if (t<0) {
            let _time = (Number(_nowYear)+1)+'/'+ v_getMonth +'/'+ v_getDate
            let endTime = new Date(_time)
            let nowTime = new Date()
            let t = endTime.getTime() - nowTime.getTime()
            _noticeDate = Math.floor(t/1000/60/60/24)
          }
          // console.log(_noticeDate)
          return _noticeDate
        }
      },
      fetchUserInfo() {
        if (this.getUserSetInfo) {
          this.statusDate = this.getUserSetInfo[0]
          if (this.statusDate == '阳历') {
            this.userBirthday = this.getUserSetInfo[1]
          } else {
            this.userBirthday = this.getUserSetInfo[2]
          }
          this.statusStr = this.statusDate.substr(0, 1)
          this.getMonth = this.userBirthday.substr(5, 2)
          this.getDate = this.userBirthday.substr(-2)
        }
      },
      getEntrInfo() {
        if (this.getUserEntrInfo) {
          this.entrDate = this.getUserEntrInfo
        }
      },
      goWishPage(service) {
        this.$router.push({path: '/wishPage', query: {currentUserId: this.currentUserInfo.id, service: service}})
      },
      goSeacrh() {
        this.$router.push('search')
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .my-home
    position: absolute
    top: 0
    bottom: 45px
    left: 0
    right: 0
    overflow: hidden
    // background
    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      // z-index: -1
      filter: blur(8px) // 滤镜设置为高斯模糊(blur)
      background: linear-gradient(to bottom, #ccc, white)
      img
        width: 100%
    .head
      position: absolute
      width: 100%
      height: 25%
      z-index: 1
      margin: auto
      text-align: center
      .head-img
        width: 60px
        height: 60px
        margin: auto
        margin-top: 10%
        border-radius: 50%
        img
          width: 100%
          border-radius: 50%
          border: 1px solid #fff
          box-sizing: border-box
        .icon-crown
          position: absolute
          margin-top: -18px
          margin-left: -15px
          font-size: 40px
          transform: rotate(-45deg)
      .head-user
        // display: flex
        width: 100%
        text-align: center
        margin-top: 10px
        .text
          margin-left: 15px
          vertical-align: top
          text-shadow: 0px 4px 7px #000
        .text, .icon
          display: inline-block
          line-height: 22px
          font-size: $font-size-medium-x
          color: #fff
          .icon-man
            display: inline-block
            line-height: 20px
            margin-left: 5px
            font-size: $font-size-medium
            color: #dcdcdc
          .icon-girl
            display: inline-block
            line-height: 22px
            font-size: $font-size-large-x
            color: #0000FF
    .redact-info
      position: absolute
      top: 25%
      width: 100%
      height: 22%
      z-index: 1
      .info-wrapp
        height: 100%
        margin: 0 18px
        // padding: 5px 0
        background: #fff
        border-radius: 10px
        .birthday-info, .company-info
          display: flex
          // margin: 15px 18px
          height: 50%
          padding: 0 18px
          .info-icon
            flex: 0 0 50px
            width: 50px
            height: 50px
            margin: auto
            border-radius: 50%
            background: rgb(252, 174, 138)
            text-align: center
            .icon-birthday, .icon-entry_company
              line-height: 50px
              font-size: $font-size-large
              color: #fff
          .info-content
            flex: 1
            display: flex
            margin: auto
            .icon
              flex: 0 0 40px
              width: 40px
              text-align: right
              .icon-right
                line-height: 50px
                font-size: $font-size-medium-x
                color: $color-dialog-background-x
            .info-text
              flex: 1
              margin-left: 10px
              .title, .text
                display: inline-block
                width: 100%
                line-height: 25px
              .title
                font-size: $font-size-medium
                color: $color-dialog-background
                .desc
                  margin-left: 5px
                  padding: 3px 5px
                  background: #FF7F00
                  border-radius: 20px
                  color: #fff
                  font-size: 12px
              .text
                font-size: $font-size-small
                color: $color-dialog-background-x
                & > i
                  font-size: $font-size-medium
                  color: rgb(252, 174, 138)
                  font-weight: bold
              .now-date
                font-size: $font-size-small
                color: rgb(252, 174, 138)
              .show-title
                .status
                  padding: 3px
                  border: 1px solid #FFD700
                  border-radius: 5px
                  font-size: 12px
                  line-height: 19px
                  color: #FFD700
                .status-yin
                  padding: 3px
                  border: 1px solid #0000FF
                  border-radius: 5px
                  font-size: 12px
                  line-height: 19px
                  color: #0000FF
                .user-date
                  font-size: 14px
                  line-height: 25px
                  color: #666
        .company-info
          .info-icon
            background: #1E90FF
        // .birthday-info
        //   border-1px(rgba(7, 17, 27, .1))
        //   box-sizing: border-box
    .sun-nav
      position: absolute
      width: 100%
      top: 47%
      height: 15%
      margin-top: 10px
      z-index: 1
      .content
        height: 100%
        margin: 0 18px
        background: #fff
        border-radius: 10px
        .sun-text
          display: flex
          justify-content: space-between
          align-items: center
          height: 50%
          margin: auto
          padding: 0 18px
          border-1px(rgba(7, 17, 27, .1))
          &:last-child
            border-none()
          .sun
            display: inline-block
            line-height: 20px
            font-size: $font-size-medium
            color: $color-dialog-background
          .right-info
            line-height: 20px
            font-size: $font-size-medium
            color: $color-dialog-background-x
    .other
      position: absolute
      width: 100%
      top: 47%
      height: 15%
      margin-top: 10px
      z-index: 1
      .content
        height: 100%
        margin: 0 18px
        background: #fff
        border-radius: 10px
        box-shadow: 0 5px 5px rgba(7, 17, 27, .1)
        .other-text
          display: flex
          justify-content: space-between
          align-items: center
          height: 50%
          margin: auto
          padding: 0 18px
          border-1px(rgba(7, 17, 27, .1))
          &:last-child
            border-none()
          .text
            display: inline-block
            line-height: 20px
            font-size: $font-size-medium
            color: $color-dialog-background
          .icon-right
            line-height: 20px
            font-size: $font-size-medium
            color: $color-dialog-background-x
    .router-slid-enter-active, .router-slid-leave-active
      transition: all 0.3s
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(30px, 0, 0)
      opacity: 0
</style>
