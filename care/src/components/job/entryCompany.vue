<template>
  <scroll ref="scroll" class="entry-page"
  :data="caresNoticeList"
  :pullup="pullup"
  @scrollToEnd="loadMore"
  :mouseWheel="mouseWheel">
    <div>
      <div class="alert" v-if="isShowAlert">
        <div class="text">
          <span class="text-left">开启入职祝福需先完善入职信息，</span>
          <span class="text-right" @click="setInformation">去设置</span>
        </div>
      </div>
      <ul style="margin-top: 10px" v-if="caresNoticeList.length>0">
        <li class="entry-list"
        v-for="(item,index) in caresNoticeList"
        @click="goBlessDetail(item.noticeid, item)"
        :class="{'old-noction': isAction == item.statusDate}">
          <div class="entry-img">
            <img :src="item.avatar" v-if="item.avatar">
            <img v-else src="./logo.jpg">
          </div>
          <div class="entry-container border-1px">
            <div class="title">
              <span class="user-name" :class="{'current-user': currentUserInfo.id === item.userid}">{{item.username}}</span>
              <div class="title-right">
                <i class="time" :class="{'time-style': item.v_date == currentDate}">{{item.currentYear}}</i>
                <span class="text">周年</span>
              </div>
            </div>
            <div class="other border-1px">
              <span class="text">{{item.jobdate | showTime}}入职</span>
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
  import {formatDate, dateFilters} from 'common/js/date'
  import {mapGetters, mapActions} from 'vuex'
  import Loading from 'base/loading/loading'

  export default {
    filters: {
      // 时间格式化过滤器
      showTime(_date) {
        if (_date) {
          return formatDate(new Date(_date *1000), "yyyy年")
        } else {
          return ''
        }
      },
    },
    data() {
      return {
        isShowAlert: false,
        pageNum: 1,
        pageSize: 20,
        caresNoticeList: [],
        _getMonth: '', // 生日月份
        _getDate: '', // 生日日期
        currentDate: null, // 当前日期
        _date: null,
        currentUserInfo: '',
        endNoticeList: [], // 入职周年已过的员工信息
        nowNoticeList: [], // 入职周年未过的员工信息
        isAction: false,
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
      this.currentDate = this.dateFilters(new Date())
      this.getData()
      this.getCurrentInfo()
    },
    methods: {
      ...mapActions([
        'saveCurrentUserInfo'
      ]),
      async getData() {
        this.hasMore = true
        this.noMore = false
        let params = {
          "noticeType": "job",
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
        }
        let url = api.serviceUrl + this.getSessionKey
        const res = await http.post(url, api.serviceStaff, params)

        if (res.data.code === api.ERR_OK) {
          let response = res.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          // console.log(response.caresNoticeList)
          let cares = response.caresNoticeList.list
          this.maxPage = response.caresNoticeList.maxPage
          this._checkMore(response.caresNoticeList)
          if (cares) {
            cares.forEach((list) => {
              let noticeDate = this.showDateTime(list.jobdate)
              let v_year = this.showYearDate(list.jobdate)
              let _Year = dateFilters(new Date())
              let currentYear = _Year.substr(0, 4) - v_year.substr(0, 4)

              // 计算生日已过的员工信息， 如果通知日期减去当前日期<0，则该员工生日已过
              let timer = this.showYearDate(list.noticetime)
              let endDay = new Date(timer)
              let nowDay = new Date()
              if ((endDay.getTime()+86400000) - nowDay.getTime() < 0) {
                this.endNoticeList.push({
                  avatar: list.avatar, // 头像
                  jobperiod: list.jobperiod, // 入职周年
                  noticeid: list.id, // 通知ID，下一页用
                  jobdate: list.jobdate, // 入职时间
                  username: list.username, // 入职员工
                  noticeDate: noticeDate,
                  gender: list.gender,
                  departmentname: list.departmentname,
                  v_status: 'job',
                  userid: list.userid,
                  currentYear: currentYear,
                  statusDate: 0,
                })
              } else {
                this.nowNoticeList.push({
                  avatar: list.avatar, // 头像
                  jobperiod: list.jobperiod, // 入职周年
                  noticeid: list.id, // 通知ID，下一页用
                  jobdate: list.jobdate, // 入职时间
                  username: list.username, // 入职员工
                  noticeDate: noticeDate,
                  gender: list.gender,
                  departmentname: list.departmentname,
                  v_status: 'job',
                  userid: list.userid,
                  currentYear: currentYear,
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
            "noticeType": "job",
          }
          let url = api.serviceUrl + this.getSessionKey
          const res = await http.post(url, api.serviceStaff, params)
          if (res.data.code === api.ERR_OK) {
            let response = res.data.data
            response = response && response === '[]' ? [] :JSON.parse(response)
            this._checkMore(response.caresNoticeList)
            let cares = []
            cares = cares.concat(response.caresNoticeList.list)
            if (cares) {
              cares.forEach((list) => {
                let noticeDate = this.showDateTime(list.jobdate)
                let v_year = this.showYearDate(list.jobdate)
                let _Year = dateFilters(new Date())
                let currentYear = _Year.substr(0, 4) - v_year.substr(0, 4)

                // 计算生日已过的员工信息， 如果通知日期减去当前日期<0，则该员工生日已过
                let timer = this.showYearDate(list.noticetime)
                let endDay = new Date(timer)
                let nowDay = new Date()
                if ((endDay.getTime()+86400000) - nowDay.getTime() < 0) {
                  this.endNoticeList.push({
                    avatar: list.avatar, // 头像
                    jobperiod: list.jobperiod, // 入职周年
                    noticeid: list.id, // 通知ID，下一页用
                    jobdate: list.jobdate, // 入职时间
                    username: list.username, // 入职员工
                    noticeDate: noticeDate,
                    gender: list.gender,
                    departmentname: list.departmentname,
                    v_status: 'job',
                    userid: list.userid,
                    currentYear: currentYear,
                    statusDate: 0,
                  })
                } else {
                  this.nowNoticeList.push({
                    avatar: list.avatar, // 头像
                    jobperiod: list.jobperiod, // 入职周年
                    noticeid: list.id, // 通知ID，下一页用
                    jobdate: list.jobdate, // 入职时间
                    username: list.username, // 入职员工
                    noticeDate: noticeDate,
                    gender: list.gender,
                    departmentname: list.departmentname,
                    v_status: 'job',
                    userid: list.userid,
                    currentYear: currentYear,
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
          Toast({
            duration: 1000,
            message: '没有更多数据了'
          })
          // this.pageNum--
        }
      },
      _checkMore(data) {
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
          return formatDate(new Date(_date *1000), "MM月dd日")
        } else {
          return ''
        }
      },
      showYearDate(_date) {
        if (_date) {
          return formatDate(new Date(_date *1000), "yyyy-MM-dd")
        } else {
          return ''
        }
      },
      dateFilters(_value) {
        let d = new Date(_value)
        let year = d.getFullYear()
        let month = d.getMonth() + 1;
        let day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate()
        let hour = d.getHours()
        let minutes = d.getMinutes()
        let seconds = d.getSeconds()
        // return  year+ '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
        return  month + '月' + day + '日'
      },
      // 倒计天数
      getDateTime(v_getMonth, v_getDate) {
        let _noticeDate = ''
        if (v_getMonth) {
          let _day = Number(v_getDate)+1
          // console.log(_day)
          let _time = '2018/'+ v_getMonth +'/'+ _day
          // console.log(_time)
          let endTime = new Date(_time)
          let nowTime = new Date()
          let t = endTime.getTime() - nowTime.getTime()
          // console.log(t)
          if (t>=0) {
            _noticeDate = Math.floor(t/1000/60/60/24)
            // console.log(t)
          }
          if (t<0) {
            let _time = '2019/'+ v_getMonth +'/'+ v_getDate
            let endTime = new Date(_time)
            let nowTime = new Date()
            let t = endTime.getTime() - nowTime.getTime()
            // console.log(t)
            _noticeDate = Math.floor(t/1000/60/60/24)
          }
          return _noticeDate
          // console.log(_noticeDate)
        }
      },
      // 去设置
      setInformation() {
        this.$router.push('myHome')
      },
      // 送祝福
      goBlessDetail(noticeid, item) {
        if (item.userid === this.currentUserInfo.id) {
          this.$router.push({path:'/myJobWish', query: {noticeId: noticeid, noticeItem: item}})
        } else {
          this.$router.push({path:'/jobBless', query: {noticeId: noticeid, noticeItem: item}})
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

  .entry-page
    position: absolute
    top: 0
    bottom: 45px
    left: 0
    right: 0
    overflow: hidden
    // background: #000
    .entry-list
      display: flex
      padding: 10px 18px
      .entry-img
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
        img
          width: 100%
          min-height: 50px
          border-radius: 3px
      .entry-container
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
            // color: #FF7F24
            .time
              font-size: 18px
              font-weight: bold
              color: #000
            .text
              font-size: 14px
              color: #000
              font-weight: bold
            .time-style
              color: #FF7F24
        .other
          display: flex
          justify-content: space-between
          align-items: center
          margin-top: 10px
          padding-bottom: 10px
          border-1px(rgba(7, 17, 27, .1))
          .text
            font-size: $font-size-small
            color: $color-dialog-background
          .icon
            font-size: $font-size-small
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
