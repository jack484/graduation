<template>
  <div class="reply-page">
    <div class="confirm-reply">
      <div class="reply-wrapp">
        <div class="reply-ipt" @click="onWriteComment">
          <span class="icon-write"></span>
          <span class="text">说点什么吧...</span>
        </div>
        <div class="confirm-wrapp">
          <span class="icon-word" @click="goReplyWrapp">
            <span class="bar" v-if="replyList.length>0">{{replyList.length}}</span>
          </span>
          <button ref="iconPraise" class="icon-praise" @click.stop="confirmPraise"></button>
        </div>
      </div>
    </div>
    <div class="dot" :class="{'dot-on': isAnimate, 'dot-up': isAnimateUp}">
      <span v-if="praiseFlag == 'Y'" class="add">+1</span>
      <span v-else class="minus">- 1</span>
    </div>
  </div>
</template>

<script>
  import {formatDate} from 'common/js/date'
  import { Toast } from 'vant'
  import *as api from 'api/api'
  import http from 'api/http'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    filters: {
      // 时间格式化过滤器
      showTime(p_inputTimeStamp) {
        if (p_inputTimeStamp) {
          return formatDate(new Date(p_inputTimeStamp *1000), "yyyy-MM-dd")
        } else {
          return ''
        }
      },
    },
    data() {
      return {
        inputValue: null,
        praiseList: [],
        isAnimate: false,
        isAnimateUp: false,
        isIconStar: false,
        praiseFlag: '',
        collectFlag: '',
      }
    },
    props: {
      albumsId: {
        type: String,
      },
      albumsDetailId: {
        type: String,
        default: ''
      },
      replyList: {
        type: Array,
        default: []
      },
    },
    beforeDestroy(){ // 销毁定时器
      clearTimeout(this.timer)
      clearTimeout(this._timer)
    },
    computed: {
      ...mapGetters([
        'getPraiseList', 'getSessionKey'
      ])
    },
    watch: {
      getPraiseList: function(value) {
        this.praiseFlag = value
        // console.log(this.praiseFlag)
        if (this.praiseFlag == 'Y') {
          this.$refs.iconPraise.style.color = '#FF3030'
        } else {
          this.$refs.iconPraise.style.color = 'rgba(7, 17, 27, .3)'
        }
      },
    },
    mounted(){
      this.fetchPraiseList()
    },
    methods: {
      fetchPraiseList() {
        if (this.getPraiseList) {
          // console.log(this.praiseFlag)
          this.praiseFlag = this.getPraiseList
          if (this.praiseFlag == 'Y') {
            this.$refs.iconPraise.style.color = '#FF3030'
          } else {
            this.$refs.iconPraise.style.color = 'rgba(7, 17, 27, .3)'
          }
        }
      },
      fetchCollectFlag() {
        if (this.getColletFlag) {
          this.collectFlag = this.getColletFlag
          if (this.collectFlag == 'Y') {
            this.isIconStar = true
          } else {
            this.isIconStar = false
          }
        }
      },
      // 点赞
      async confirmPraise() {
        // console.log(this.praiseFlag)
        let isAction = ''
        if (this.praiseFlag == 'Y') {
          isAction = 'N'
        } else {
          isAction = 'Y'
        }
        let params = {
          "albumsId": this.albumsId,
          "albumsDetailId": this.albumsDetailId,
          "action": isAction,
          "sessionKey": this.getSessionKey,
        }
        let url = api.serviceUrl + this.getSessionKey
        const praiseDatas = await http.post(url, api.servicePraise, params)
        if (praiseDatas.data.code === api.ERR_OK) {
          // Toast(praiseDatas.data)
          this.$emit('confirmPraise')
        } else {
          Toast({
            duration: 1000,
            message: praiseDatas.data.msg
          })
        }

        // 点赞时+1 -1的淡入和淡出
        this.isAnimate = true
        this.timr = setTimeout(() => {
          clearTimeout(this.timr)
          this.isAnimateUp = true
        }, 1000)
        this._timer = setTimeout(() => {
          clearTimeout(this._timer)
          this.isAnimate = false
          this.isAnimateUp = false
        }, 2000)

      },
      // 收藏
      async confirmFavorit() {
        let isCollect = ''
        if (this.collectFlag == 'Y') {
          isCollect = 'N'
        } else {
          isCollect = 'Y'
        }
        // let params = {
        //   "newsId": this.newsId,
        //   "action": isCollect,
        //   "sessionKey": "testSessionKey",
        // }
        // let url = api.serviceUrl + api.testUrl
        // const favoritDatas = await http.post(url, api.serviceNewsFavorit, params)
        // // console.log(favoritDatas)
        // if (favoritDatas.data.code === api.ERR_OK) {
        //   if (isCollect == 'Y') {
        //     Toast('收藏成功')
        //   } else {
        //     Toast('取消收藏')
        //   }
        // }
        this.$emit('confirmFavorit')
      },
      onWriteComment() {
        this.$emit('onWriteComment')
      },
      goReplyWrapp() {
        this.$emit('goReplyWrapp')
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .reply-page
    width: 100%
    height: 40px
    .reply-wrapp
      display: flex
      margin: 0 18px
      .reply-ipt
        flex: 1
        background: #fff
        margin: 5px 0
        height: 30px
        border-radius: 20px
        display: flex
        .icon-write
          flex: 0 0 30px
          width: 30px
          line-height: 30px
          margin-left: 3px
          font-size: $font-size-medium-x
          color: $color-dialog-background-x
        .text
          flex: 1
          padding-right: 5px
          line-height: 30px
          border-top-right-radius: 20px
          border-bottom-right-radius: 20px
          // outline: none
          font-size: $font-size-medium
          color: $color-dialog-background-x
      .confirm-wrapp
        flex: 0 0 90px
        width: 90px
        text-align: center
        display: flex
        justify-content: space-between
        .icon-word, .icon-praise, .icon-favorites_empty, .icon-five_star
          // margin-left: 5px
          padding: 0 10px
          line-height: 40px
          font-size: $font-size-medium-x
        .icon-praise
          background: transparent
          border: none
          outline: none
          color: rgba(7, 17, 27, .1)
        .icon-word
          position: relative
          margin-left: 10px
          .bar
            display: inline-block
            position: absolute
            margin-left: -5px
            line-height: 10px
            top: 5px
            padding: 2px
            height: 10px
            font-size: 10px
            background: red
            border-radius: 4px
            color: #fff
        .icon-five_star
          color: #eec900 !important
    .dot
      position: absolute
      top: 35px
      width: 90px
      right: -8px
      // margin-right: 10px
      text-align: center
      transition: all 1s
      opacity: 0
      .add, .minus
        padding: 0 3px
        color: #fff
        font-size: 12px
        border-radius: 3px
      .add
        background: #FF3030
      .minus
        background: #999
    .dot-on
      top: 0px
      opacity: 1
    .dot-up
      top: -2px
      opacity: 0
</style>
