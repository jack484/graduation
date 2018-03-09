<template>
  <transition name="router-slid" mode="out-in">
  <div class="set-info">
    <div class="set-container">
      <ul class="set-ul" v-if="currentIndex==0">
        <li class="set-list border-1px">
          <span class="info">生日提醒</span>
          <div class="select" @click="showSelect">
            <span  class="text">{{birthdayValue}}</span>
            <span class="icon-right"></span>
          </div>
        </li>
        <li class="set-list border-1px">
          <span class="info">阳历生日</span>
          <div class="select" @click="showNewDate">
            <span  class="text">{{birthdayDate}}</span>
            <span class="icon-right"></span>
          </div>
        </li>
        <li class="set-list border-1px">
          <span class="info">阴历生日</span>
          <div class="select" @click="showOldDate">
            <span  class="text">{{lunarDate}}</span>
            <span class="icon-right"></span>
          </div>
        </li>
      </ul>
      <ul class="set-ul" v-if="currentIndex==1">
        <li class="set-list border-1px">
          <span class="info">入职日期</span>
          <div class="select" @click="showEntryDate">
            <span  class="text">{{entryDate}}</span>
            <span class="icon-right"></span>
          </div>
        </li>
      </ul>

      <!-- <div class="nongli">

        <div>
        <label>阳历：</label>
        <input type="text" v-model="dateValue" name="" @click="showClaert">
        </div>

        <div>
        <label>农历：</label>
        <input type="text" v-model="lunarValue" name="">
        </div>
        <button @click="calendarSelec">日历转换方法</button>
      </div> -->
      <div class="confirm-set" @click="confirmSet" v-if="currentIndex==0">
        <button class="confirm">保 存</button>
      </div>
      <div class="confirm-set" @click="confirmEntr" v-if="currentIndex==1">
        <button class="confirm">保 存</button>
      </div>
      <!-- <wv-picker v-model="ticketPickerShow" :slots="ticketSlots" @change="onChange"></wv-picker> -->
      <van-picker
        v-show="isShowSelect"
        show-toolbar
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
      <van-datetime-picker v-show="showSelectDate"
       v-model="currentDate"
       type="date"
       :title="oTitle"
       :min-date="minDate"
       :max-date="maxDate"
       year-format="{value} 年"
       month-format="{value} 月"
       date-format="{value} 日"
       @cancel="onCancelDate"
       @confirm="onConfirmDate"/>
       <van-picker class="lunar"
       v-show="showLunarPick"
       show-toolbar
       :title="oTitle"
       @cancel="cancelLunar"
       @confirm="confirmLunar"
       :columns="columns1"
       @change="onChange" />
    </div>
  </div>
  </transition>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import {formatDate} from 'common/js/date'
  import { Toast } from 'vant'
  import *as api from 'api/api'
  import http from 'api/http'
  import {mapGetters, mapActions} from 'vuex'
  const lunarDate = {
    '正月': ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', ],
    '二月': ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', ],
    '三月': ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', ],
    '四月': ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', ],
    '五月': ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', ],
    '六月': ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', ],
    '七月': ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', ],
    '八月': ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', ],
    '九月': ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', ],
    '十月': ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', ],
    '冬月': ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', ],
    '腊月': ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', ],
  }

  export default {
    data() {
      return {
        columns1: [
          {
            values: Object.keys(lunarDate),
            className: 'column1'
          },
          {
            values: lunarDate['正月'],
            className: 'column2',
            defaultIndex: 3
          }
        ],
        oTitle: '请选择',
        columns: ['阳历', '阴历'],
        isShowSelect: false,
        birthdayValue: '阳历',
        ticketPickerShow: false,
        currentDate: new Date(1990, 0, 1),
        minDate: new Date(1940, 0, 1),
        maxDate: new Date(),
        showSelectDate: false, // 是否显示日期选择
        birthdayDate: '请选择日期', // 阳历生日日期
        lunarDate: '请选择日期', // 农历生日日期
        currentIndex: null,
        entryDate: '请选择日期', // 入职时间
        dateValue: null,
        lunarValue: null, // 农历生日选择
        _lunarValue: null, // 选农历生日时，要返回后台的参数
        showLunarPick: false,
        _lunarDate: '', // 当选阳历时 要传的阴历日期
        birthdayType: '',
      }
    },
    created() {
      this.currentIndex = this.$route.query.index
      this.birthdayType = this.$route.query.birthdayType
      // console.log(this.birthdayType)
    },
    computed: {
      ...mapGetters([
        'getSessionKey'
      ])
    },
    mounted() {
      if (this.birthdayType == 0) {
        this.birthdayValue = '阳历'
      } else {
        this.birthdayValue = '阴历'
      }
      // this.calendarSelec()
    },
    methods: {
      onChange(picker, values) {
        // let p = picker.setColumnValues(1, lunarDate[values[0]])
        // console.log(p)
      },
      showClaert() {
        this.showSelectDate = !this.showSelectDate
      },
      cancelLunar() {
        this.showLunarPick = false
      },
      confirmLunar(picker, values) {
        let monthPick = picker[0]
        let dayPick = picker[1]
        let _monthValue = values[0]++ < 10 ? '0' + values[0]++ : '' + values[0]++
        let _dayValue = values[1]++ < 10 ? '0' + values[1]++ : '' + values[1]++
        this.lunarDate = monthPick + dayPick
        this._lunarValue = _monthValue + _dayValue
        this.showLunarPick = false
      },
      calendarSelec() {
        let _year = ''
        let _month = ''
        let _day = ''
        if (this.birthdayDate) {
          _year = this.birthdayDate.substr(0, 4)
          _month = this.birthdayDate.substr(5, 2)
          _day = this.birthdayDate.substr(-2, 2)
        }
        if(_month[0] == 0) {
          _month = _month.substr(1, 1)
        }
        if(_day[0] == 0) {
          _day = _day.substr(1, 1)
        }
        let lunar1 = calendar.solar2lunar(_year, _month, _day)
        this.lunarValue = lunar1.lYear + '年' + lunar1.IMonthCn + lunar1.IDayCn
        this.lunarDate = this.lunarValue

        let _lMonth = lunar1.lMonth < 10 ? '0' + lunar1.lMonth : '' + lunar1.lMonth
        let _lDay = lunar1.lDay < 10 ? '0' + lunar1.lDay : '' + lunar1.lDay
        this._lunarDate = _lMonth + _lDay
      },
      ...mapActions([
        'saveUserSetInfo', 'saveUserEntrInfo',
      ]),
      // 选择阴历阳历
      onConfirm(value, index) {
        // Toast(`请您选择${value}生日日期哦`)
        // console.log(value)
        this.isShowSelect = false
        this.birthdayValue = value
      },
      // 关闭阴历阳历选择列表
      onCancel() {
        this.isShowSelect = false
      },
      // 是否显示阴历阳历选择
      showSelect() {
        this.isShowSelect = !this.isShowSelect
      },
      // 生日日期选择列表
      onConfirmDate(value, index) {
        if (this.birthdayValue == '阳历') {
          this.birthdayDate = formatDate(value, 'yyyy-MM-dd')
        } else {
          this.birthdayDate = formatDate(value, 'yyyy-MM-dd')
          this.lunarDate = this.lunarValue
        }
        this.entryDate = formatDate(value, 'yyyy-MM-dd')
        this.showSelectDate = false

        this.calendarSelec()
      },
      onCancelDate() {
        this.showSelectDate = false
      },
      // 选择阳历
      showNewDate() {
        this.showSelectDate = !this.showSelectDate
      },
      // 选择阴历
      showOldDate() {
        if (this.birthdayValue == '阳历') {
          Toast({
            duration: 1000,
            message: '请先选择阴历哦'
          })
          return
        }
        this.showLunarPick = !this.showLunarPick
      },
      // 确认修改
      async confirmSet() {
        if (!this.birthdayValue) {
          Toast({
            duration: 1000,
            message: '请选择阳历还是阴历'
          })
          return
        } else if (this.birthdayDate == '请选择日期' && this.lunarDate == '请选择日期') {
          Toast({
            duration: 1000,
            message: '您尚未选择生日日期哦'
          })
          return
        }

        // return
        let v_remindType = ''
        let v_solarDate = ''
        let v_lunarDate = ''
        if (this.birthdayValue == '阳历') {
          v_remindType = 0
          v_solarDate = this.birthdayDate
          v_lunarDate = this._lunarDate
        } else {
          if (this.birthdayDate == '请选择日期') {
            v_solarDate = ''
          } else {
            v_solarDate = this.birthdayDate
          }
          v_remindType = 1
          v_lunarDate = this._lunarValue
        }
        // 发起修改日期请求

        let params = {
          "remindType": v_remindType,
          "jobDate": '',
          "solarDate": v_solarDate,
          "lunarDate": v_lunarDate,
          "sessionKey": this.getSessionKey,
        }
        let url = api.serviceUrl + this.getSessionKey
        const solarData = await http.post(url, api.serviceInfo, params)
        // console.log(solarData)
        if (solarData.data.code === api.ERR_OK) {
          Toast({
            duration: 1000,
            message: '修改成功'
          })
        } else {
          Toast({
            duration: 1000,
            message: solarData.data.msg
          })
        }

        let infoArr = []
        infoArr.push(this.birthdayValue)
        infoArr.push(this.birthdayDate)
        infoArr.push(this.lunarDate)
        // console.log(infoArr)
        this.saveUserSetInfo(infoArr)
        // 完成请求，返回上一页
        // Toast.loading({ mask: true })
        this.$router.go(-1)
      },
      showEntryDate() {
        this.showSelectDate = !this.showSelectDate
      },
      // 确认入职修改
      async confirmEntr() {
        // console.log(this.entryDate)
        if (this.entryDate == '请选择日期') {
          Toast({
            duration: 1000,
            message: '您尚未选择日期'
          })
          return
        }

        let params = {
          "remindType": '',
          "jobDate": this.entryDate,
          "solarDate": '',
          "lunarDate": '',
          "sessionKey": this.getSessionKey,
        }
        // return
        let url = api.serviceUrl + this.getSessionKey
        const jobData = await http.post(url, api.serviceInfo, params)
        // console.log(jobData)
        if (jobData.data.code === api.ERR_OK) {
          Toast({
            duration: 1000,
            message: '修改成功'
          })
        } else {
          Toast({
            duration: 1000,
            message: jobData.data.msg
          })
        }
        this.saveUserEntrInfo(this.entryDate)
        this.$router.go(-1)
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .set-info
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 11
    overflow: hidden
    background: #fcfcfc
    .set-container
      width: 100%
      background: #fff
      .set-ul
        .set-list
          display: flex
          justify-content: space-between
          align-items: center
          margin: 0 18px
          padding: 15px 0
          border-1px(rgba(7, 17, 27, .1))
          &:last-child
            border-none()
          .info
            display: inline-block
            line-height: 20px
            font-size: $font-size-medium
          .select
            line-height: 20px
            font-size: $font-size-medium
            .icon-right
              font-size: $font-size-small
              color: $color-dialog-background-x
            .text
              margin-right: 10px
      .confirm-set
        position: fixed
        width: 100%
        bottom: 0
        height: 40px
        background: #1E90FF
        .confirm
          width: 100%
          height: 100%
          font-size: $font-size-medium-x
          color: #fff
          background: transparent
          outline: none
          border: none
    .router-slid-enter-active, .router-slid-leave-active
      transition: all 0.3s
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(30px, 0, 0)
      opacity: 0
</style>
