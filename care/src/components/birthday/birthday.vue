<template>
  <scroll ref="scroll" class="birthday-page"
  :data="caresNoticeList"
  :pullup="pullup"
  @scrollToEnd="loadMore"
  :mouseWheel="mouseWheel">
    <div>
      <div class="alert" v-if="isShowAlert">
        <div class="text">
          <span class="text-left">开启生日祝福需先完善生日信息，</span>
          <span class="text-right" @click="setInformation">去设置</span>
        </div>
      </div>
      <ul style="margin-top: 10px">
        <li class="birthday-list"
        v-for="(item,index) in caresNoticeList"
        @click="goBlessDetail(item.noticeid, item)"
        :class="{'old-noction': isAction == item.statusDate}">
          <div class="birthday-img">
            <span class="icon" v-if="item.noticeDate == 0 || item.noticetime == 0"><i class="icon-crown"></i></span>
            <img :src="item.avatar" v-if="item.avatar">
            <img v-else src="./logo.jpg">
          </div>
          <div class="birthday-container border-1px">
            <div class="title">
              <span class="user-name" :class="{'current-user': currentUserInfo.id == item.userid}">{{item.username}}</span>
              <div class="title-right" v-if="item.remindtype == 0 && item.noticeDate == 0">
                <span class="icon"><i class="icon-birthday"></i></span>
                <span class="text">今天</span>
              </div>
              <div class="title-right" v-else-if="item.remindtype == 1 && item.noticetime == 0">
                <span class="icon"><i class="icon-birthday"></i></span>
                <span class="text">今天</span>
              </div>
              <div v-else class="notice-date">
                <div v-if="item.statusDate === 1">
                  <i class="date" v-if="item.remindtype == 0">{{item.noticeDate}}</i>
                  <i class="date" v-else>{{item.noticetime}}</i>
                  <span class="text">天后</span>
                </div>
                <div v-else>
                  <span class="old-text">生日已过</span>
                </div>
              </div>
            </div>
            <div class="other border-1px" >
              <div class="status">
                <span class="text-yang" v-if="item.remindtype == 0">阳</span>
                <span v-else class="text-yin">阴</span>
                <span class="text" v-if="item.remindtype == 0">{{item.solardate | showTime}}</span>
                <span class="text" v-else>{{item.lunardate}}</span>
              </div>
              <span class="icon">送祝福<i class="icon-right"></i></span>
            </div>
          </div>
        </li>
        <loading v-show="hasMore" title=""></loading>
        <div class="empty-alert" v-show="noMore">已全部加载完</div>
      </ul>
    </div>
    <transition name="router-slid" mode="out-in">
      <router-view/>
    </transition>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import { Toast } from 'vant'
  import *as api from 'api/api'
  import http from 'api/http'
  import {formatDate} from 'common/js/date'
  import {mapGetters, mapActions} from 'vuex'
  import Loading from 'base/loading/loading'

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
        isShowAlert: false, // 如果个人信息未设置，则提示设置信息
        pageNum: 1,
        pageSize: 20,
        caresNoticeList: [],
        endNoticeList: [], // 生日已过的员工信息
        nowNoticeList: [], // 生日未过的员工信息
        _getMonth: '', // 生日月份
        _getDate: '', // 生日日期
        currentUserInfo: '', // 当前用户信息
        isAction: false,
        noticeYear: '', // 推送的年份
        hasMore: false,
        noMore: false,
        maxPage: null, // 总页数
        pullup: true,
        mouseWheel: true,
      }
    },
    computed: {
      ...mapGetters([
        'getSessionKey'
      ])
    },
    mounted() {
      this.getData()
      this.getCurrentInfo()
    },
    methods: {
      ...mapActions([
        'saveCurrentUserInfo'
      ]),
      // 获取列表数据
      async getData() {
        this.hasMore = true
        this.noMore = false
        let params = {
          "noticeType": "birthday",
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
        }
        let url = api.serviceUrl + this.getSessionKey
        const res = await http.post(url, api.serviceStaff, params)
        if (res.data.code === api.ERR_OK) {
          let response = res.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          // console.log(response.caresNoticeList)
          this.maxPage = response.caresNoticeList.maxPage
          this._checkMore(response.caresNoticeList)
          let careDatas = response.caresNoticeList.list
          if (careDatas) {
            careDatas.forEach((list) => {
              this.noticeYear = list.noticeyear
              // 阴历生日转换
              let l_month = ''
              let l_day = ''
              if (list.lunardate != null) {
                let _month = list.lunardate.substring(0, 2)
                let _day = list.lunardate.substring(2)
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
              }
              let _lunarDate = l_month + l_day // 阴历要显示的日月

              // 阴历剩余天数
              let v_noticetime  = this.showDateTime(list.noticetime)
              let l_getMonth = v_noticetime.substr(5, 2)
              let l_getDay = v_noticetime.substr(-2)
              let _noticetime = this.getDateTime(l_getMonth, l_getDay)

              // 阳历剩余天数
              let v_date = this.showDateTime(list.solardate)
              this._getMonth = v_date.substr(5, 2)
              this._getDate = v_date.substr(-2)
              let noticeDate = this.getDateTime(this._getMonth, this._getDate)

              // 计算生日已过的员工信息， 如果通知日期减去当前日期<0，则该员工生日已过
              let timer = this.showDateTime(list.noticetime)
              let endDay = new Date(timer)
              let nowDay = new Date()
              if ((endDay.getTime()+86400000) - nowDay.getTime() < 0) {
                this.endNoticeList.push({
                  avatar: list.avatar, // 头像
                  remindtype: list.remindtype, // 阳历还是阴历
                  noticeid: list.id, // 通知ID，下一页用
                  solardate: list.solardate, // 阳历生日
                  lunardate: _lunarDate, // 阴历生日
                  username: list.username,
                  noticemusic: list.noticemusic,
                  noticeDate: noticeDate,
                  gender: list.gender,
                  departmentname: list.departmentname,
                  v_status: 'birthday',
                  userid: list.userid,
                  noticetime: _noticetime,
                  statusDate: 0,
                })
              } else {
                this.nowNoticeList.push({
                  avatar: list.avatar, // 头像
                  remindtype: list.remindtype, // 阳历还是阴历
                  noticeid: list.id, // 通知ID，下一页用
                  solardate: list.solardate, // 阳历生日
                  lunardate: _lunarDate, // 阴历生日
                  username: list.username,
                  noticemusic: list.noticemusic,
                  noticeDate: noticeDate,
                  gender: list.gender,
                  departmentname: list.departmentname,
                  v_status: 'birthday',
                  userid: list.userid,
                  noticetime: _noticetime,
                  statusDate: 1,
                })
              }
            })
          }
          this.caresNoticeList = this.nowNoticeList.concat(this.endNoticeList.reverse())
        } else {
          Toast({
            duration: 1000,
            message: res.data.msg
          })
        }
      },
      async loadMore() {
        if (!this.hasMore) {
          return
        }
        if (this.pageNum++ < this.maxPage) {
          let params = {
            "pageNum": this.pageNum,
            "pageSize": this.pageSize,
            "noticeType": "birthday",
          }
          let url = api.serviceUrl + this.getSessionKey
          const res = await http.post(url, api.serviceStaff, params)
          if (res.data.code === api.ERR_OK) {
            let response = res.data.data
            response = response && response === '[]' ? [] :JSON.parse(response)
            this._checkMore(response.caresNoticeList)
            let careDatas = []
            careDatas = careDatas.concat(response.caresNoticeList.list)
            if (careDatas) {
              careDatas.forEach((list) => {
                this.noticeYear = list.noticeyear
                // 阴历生日转换
                let l_month = ''
                let l_day = ''
                if (list.lunardate != null) {
                  let _month = list.lunardate.substring(0, 2)
                  let _day = list.lunardate.substring(2)
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
                }
                let _lunarDate = l_month + l_day // 阴历要显示的日月

                // 阴历剩余天数
                let v_noticetime  = this.showDateTime(list.noticetime)
                let l_getMonth = v_noticetime.substr(5, 2)
                let l_getDay = v_noticetime.substr(-2)
                let _noticetime = this.getDateTime(l_getMonth, l_getDay)

                // 阳历剩余天数
                let v_date = this.showDateTime(list.solardate)
                this._getMonth = v_date.substr(5, 2)
                this._getDate = v_date.substr(-2)
                let noticeDate = this.getDateTime(this._getMonth, this._getDate)

                // 计算生日已过的员工信息， 如果通知日期减去当前日期<0，则该员工生日已过
                let timer = this.showDateTime(list.noticetime)
                let endDay = new Date(timer)
                let nowDay = new Date()
                if ((endDay.getTime()+86400000) - nowDay.getTime() < 0) {
                  this.endNoticeList.push({
                    avatar: list.avatar, // 头像
                    remindtype: list.remindtype, // 阳历还是阴历
                    noticeid: list.id, // 通知ID，下一页用
                    solardate: list.solardate, // 阳历生日
                    lunardate: _lunarDate, // 阴历生日
                    username: list.username,
                    noticemusic: list.noticemusic,
                    noticeDate: noticeDate,
                    gender: list.gender,
                    departmentname: list.departmentname,
                    v_status: 'birthday',
                    userid: list.userid,
                    noticetime: _noticetime,
                    statusDate: 0,
                  })
                } else {
                  this.nowNoticeList.push({
                    avatar: list.avatar, // 头像
                    remindtype: list.remindtype, // 阳历还是阴历
                    noticeid: list.id, // 通知ID，下一页用
                    solardate: list.solardate, // 阳历生日
                    lunardate: _lunarDate, // 阴历生日
                    username: list.username,
                    noticemusic: list.noticemusic,
                    noticeDate: noticeDate,
                    gender: list.gender,
                    departmentname: list.departmentname,
                    v_status: 'birthday',
                    userid: list.userid,
                    noticetime: _noticetime,
                    statusDate: 1,
                  })
                }
              })
            }
            this.caresNoticeList = this.nowNoticeList.concat(this.endNoticeList.reverse())
          } else {
            Toast({
              duration: 1000,
              message: res.data.msg
            })
          }
        } else {
          // Toast({
          //   duration: 1000,
          //   message: '没有更多数据了'
          // })
          // this.pageNum--
        }
      },
      _checkMore(data) {
        // console.log(this.pageNum)
        if (!data.list.length || (data.pageNo * this.pageSize) > data.totalCount) {
          this.hasMore = false
          this.noMore = true
        }
      },
      // 获取当前用户数据
      async getCurrentInfo() {
        let params = {
          "sessionKey": this.getSessionKey,
        }
        let url = api.serviceUrl + this.getSessionKey
        const currentDatas = await http.post(url, api.serviceMe, params)
        if (currentDatas.data.code === api.ERR_OK) {
          let response = currentDatas.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)

          this.currentUserInfo = response.currentUser
          this.saveCurrentUserInfo(this.currentUserInfo)

          // 如果个人信息未设置，则提示设置信息
          if (this.currentUserInfo.birthDay == null) {
            this.isShowAlert = true
          } else {
            this.isShowAlert = false
          }
        } else {
          Toast({
            duration: 1000,
            message: currentDatas.data.msg
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
      // 如果个人信息不完善，就去设置信息
      setInformation() {
        this.$router.push('myHome')
      },
      // 送祝福
      goBlessDetail(noticeid, item) {
        if (item.userid === this.currentUserInfo.id) {
          this.$router.push({path:'/myWishDetail', query: {noticeId: noticeid, noticeItem: item}})
        } else {
          this.$router.push({path:'/birthdayBless', query: {noticeId: noticeid, noticeItem: item}})
        }
      },
    },
    components: {
      Scroll,
      Loading,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .birthday-page
    position: absolute
    top: 0
    bottom: 45px
    left: 0
    right: 0
    overflow: hidden
    // background: #000
    .birthday-list
      display: flex
      padding: 10px 18px
      .birthday-img
        flex: 0 0 50px
        width: 50px
        margin-right: 10px
        .icon
          position: absolute
          transform: rotate(-45deg)
          margin-left: -10px
          margin-top: -10px
          .icon-crown
            font-size: 30px
            color: #FFD700 !important
        img
          margin-top: 5px
          width: 100%
          border-radius: 3px
      .birthday-container
        flex: 1
        .title
          display: flex
          justify-content: space-between
          align-items: center
          line-height: 28px
          .user-name
            font-size: $font-size-medium-x
            color: $color-highlight-background
          .current-user
            color: #0000FF
          .title-right
            color: #FF7F24
            .icon
              .icon-birthday
                font-size: $font-size-large-x
            .text
              font-size: $font-size-medium
              font-weight: bold
          .notice-date
            line-height: 18px
            .date
              font-size: 18px
              font-weight: bold
              color: #000
            .text
              font-size: 14px
              font-weight: bold
            .old-text
              font-size: 14px
              color: #999
        .other
          display: flex
          justify-content: space-between
          align-items: center
          margin-top: 5px
          padding-bottom: 10px
          border-1px(rgba(7, 17, 27, .1))
          .status
            .text-yang, .text-yin
              padding: 3px
              border-radius: 5px
              font-size: 12px
              line-height: 20px
            .text-yang
              border: 1px solid #FFD700
              color: #FFD700
            .text-yin
              color: #0000FF
              border: 1px solid #0000FF
            .text
              line-height: 20px
              font-size: $font-size-medium
              color: $color-dialog-background
          .icon
            font-size: $font-size-medium
            color: $color-dialog-background-x
    .empty-alert
      text-align: center
      line-height: 30px
      padding-bottom: 10px
      font-size: $font-size-small
      color: $color-dialog-background-x
      background: rgba(7, 17, 27, .05)
    .old-noction
      background: rgba(7, 17, 27, .05)
    .alert
      // width: 100%
      height: 40px
      line-height: 40px
      background: #FFFACD
      padding: 0 18px
      .text-left, .text-right
        font-size: $font-size-medium
      .text-left
        color: #FFB90F
      .text-right
        color: #1E90FF
    .router-slid-enter-active, .router-slid-leave-active
      transition: all 0.3s
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(30px, 0, 0)
      opacity: 0
</style>
