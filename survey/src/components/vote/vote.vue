<template>
  <transition>
    <div class="vote">
      <div class="surve-wrapper" >
        <scroll class="scroll" ref="scrollList"
          :data="listArr"
          @scrollToEnd="scrollToEnd"
          @pulldown="pulldown"
          :mouseWheel="mouseWheel">
          <div>
          <ul style="background: #fff" v-if="listArr.length > 0">
            <li @click="openDetail(item.id,item.viewflag,item.doneflag, item.validto)" v-for="(item,index) in listArr" :key="index" style="border-bottom: 1px solid rgba(7, 17, 27, .1)">
              <div class="vote-content">
                <p class="vote-title">
                  <span class="no-answer" v-show="item.doneflag===0">未投票</span>
                  <span class="answered" v-show="item.doneflag===1">已投票</span>
                  <span class="">{{item.name}}</span>
                </p>
                <div class="vote-total">
                  <div class="vote-total-item total-left">
                    <p>
                      <span>{{item.validto | dateTime}} 截止</span>
                    </p>
                  </div>
                  <div class="vote-total-item total-right">
                    <span class="vote-count">{{item.replyqty}}人参与</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="empty">
            <span>暂无数据</span>
          </div>
          </div>
          <div class="loading-wrapper" v-show="isShowLoading">
            <loading></loading>
          </div>
        </scroll>
      </div>
    </div>
  </transition>
</template>
<script>
import axios from 'axios'
import Tab from '../tab/tab'
import {url, getUrlKey} from 'api/api'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {formatDate} from 'common/js/date'

export default {
  filters: {
    // 时间格式化过滤器
    showTime(_time) {
      if (_time) {
        return formatDate(new Date(_time * 1000), "yyyy-MM-dd")
      } else {
        return ''
      }
    },
    dateTime(_date) {
      if (_date) {
        return formatDate(new Date(_date * 1000), "yyyy-MM-dd hh:mm:ss")
      } else {
        return ''
      }
    }
  },
  data() {
    return {
      url: '',
      listArr: [],
      pageNum: 1, // 第几页，
      pageSize: 20, // 每页显示条数
      pageMax: 0, // 最大显示的页数
      serviceCode: 'SVCQY11010',
      category: 2, // 1,代表调研 2,代表投票
      isShowLoading: true,
      mouseWheel: true,
    }
  },
  created() {
    this._initPullDown()
  },
  methods: {
    // 上拉加载
    scrollToEnd() {
      // console.log('上拉')
      this._initPullUp()
    },
    pulldown() {
      // console.log('下拉')
      this._initPullDown()
    },
    _initPullDown() {
      let key = getUrlKey('s')
      this.url = url() + key
      let param = JSON.stringify({
        category: this.category,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
      let params = {
        serviceCode: this.serviceCode,
        data: param
      }
      axios.post(this.url, params).then((res) => {
        if (res.data.code === 0) {
          // console.log(res.data)
          let response = res.data.data
          let totalPage = response.recordsFiltered // 总条数
          this.pageMax = Math.ceil(totalPage / this.pageSize)
          if (this.listArr) {
            this.listArr.splice(0, response.data.length)
          }
          this.listArr = this.listArr.concat(response.data)
          // console.log(this.listArr)
          this.isShowLoading = false
        } else {
          this.$toast.center(res.data.msg)
          this.isShowLoading = false
        }
      }).catch((error) => {
        this.isShowLoading = false
        this.$toast.center(error)
      })
    },
    _initPullUp() {
      if (this.pageNum > this.pageMax) {
        this.$toast.center(`暂无更多数据...`)
        return false
      } else {
        this.$toast.center(`正在加载...`)
        this.pageNum++
        let param = JSON.stringify({
          category: this.category,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
        let params = {
          serviceCode: this.serviceCode,
          data: param
        }
        axios.post(this.url, params).then((res) => {
          if (res.data.code === 0) {
            let response = res.data.data.data
            // console.log(res)
            this.listArr = this.listArr.concat(response)
          } else {
            this.$toast.center(res.data.msg)
          }
        }).catch((error) => {
          this.$toast.center(error)
        })
      }
    },
    // 时间格式化
    showDateTime(_date) {
      if (_date) {
        return formatDate(new Date(_date *1000), "yyyy/MM/dd hh:mm:ss")
      } else {
        return ''
      }
    },
    openDetail(id, viewflag, doneflag, validTime) {
      let timer = this.showDateTime(validTime) // 有效期限
      let endTime = new Date(timer)
      let nowTime = new Date()
      // console.log(endTime)
      // console.log(timer)
      // console.log(nowTime.getTime() - endTime.getTime())
      sessionStorage.setItem('countId', id)
      let key = getUrlKey('s')
      // 已经参加过投票
      if (doneflag) {
        if (viewflag) {
          this.$router.push({
            path: '/vote-count?s=' + key
          })
        } else {
          this.$toast.center(`管理员设置不能查看结果`)
        }
      } else {
        // 第一次参加投票
        if (nowTime.getTime() - endTime.getTime() > 0) {
          this.$toast.center(`本次投票已结束，请期待下次活动`)
        } else {
          this.$router.push({
            path: '/vote-detail?s=' + key, query: {queryId: id}
          })
        }
      }
    },
  },
  components: {
    Scroll,
    Tab,
    Loading
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
  .vote
    position:absolute
    top: 0
    left: 0
    bottom :44px
    background:#EEEEEE
    width: 100%
    height:100%
    z-index:1
    overflow:hidden
    .scroll
      width: 100%
      height:auto
      position:fixed
      top: 0
      bottom:44px
      overflow:hidden
    .vote-content
      width: 90%
      background:#fff
      margin:0 auto
      padding:8px 5px
      .vote-title
        font-size: 16px
        padding: 10px 0
        .no-answer,.answered
          border-radius: 5px
          margin-right: 5px
          color: #fff
          padding: 3px
          font-size: 12px
        .no-answer
          background:#F4AB7B
        .answered
          background:#CCC
          color:#FFF
      .vote-total
        display:flex
        justify-content:space-around
        font-size: 12px
        color:#999999
        margin-top:10px
        padding-bottom:10px
        .vote-total-item
          flex:1
          .vote-count
            margin-left:0
        .total-right
          text-align:right
    .empty
      margin-top: 60px
      text-align: center
      font-size: 12px
      color: #666
    .loading-wrapper
      position:absolute
      top: 80px
      left:0
      width:100%
      margin:0 auto
      z-index:1
</style>
