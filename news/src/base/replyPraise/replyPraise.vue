<template>
  <div class="reply-page">
    <div class="confirm-reply">
      <div class="reply-wrapp">
        <div class="reply-ipt" @click="onWriteComment">
          <span class="icon-write"></span>
          <span class="text">说点什么吧...</span>
        </div>
        <div class="confirm-wrapp">
          <button class="icon-word" @click="goReplyWrapp">
            <span class="bar" v-if="newsReplyList.length>0">{{newsReplyList.length}}</span>
          </button>
          <button ref="iconPraise" class="icon-praise" @click="confirmPraise"></button>
          <button ref="colllect" class="icon-favorites_empty"
          :class="{'icon-five_star': isIconStar}"
          @click="confirmFavorit"></button>
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
      newsId: {
        type: String,
      },
      newsReplyList: {
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
        'getPraiseList', 'getColletFlag', 'getSessionKey'
      ])
    },
    watch: {
      getPraiseList: function(value) {
        this.praiseFlag = value
        if (this.praiseFlag == 'Y') {
          this.$refs.iconPraise.style.color = '#FF3030'
        } else {
          this.$refs.iconPraise.style.color = 'rgba(7, 17, 27, .3)'
        }
      },
      getColletFlag: function(nowFlag) {
        this.collectFlag = nowFlag
        if (this.collectFlag == 'Y') {
          this.isIconStar = true
        } else {
          this.isIconStar = false
        }
      }
    },
    mounted(){
      this.fetchPraiseList()
      this.fetchCollectFlag()
    },
    methods: {
      fetchPraiseList() {
        if (this.getPraiseList) {
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
        let isAction = ''
        if (this.praiseFlag == 'Y') {
          isAction = 'N'
        } else {
          isAction = 'Y'
        }
        let params = {
          "newsId": this.newsId,
          "action": isAction,
          "sessionKey": this.getSessionKey,
        }
        let url = api.serviceUrl + this.getSessionKey
        const praiseDatas = await http.post(url, api.serviceNewsPraise, params)
        if (praiseDatas.data.code === api.ERR_OK) {
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

        this.$emit('confirmPraise')
      },
      // 收藏
      async confirmFavorit() {
        let isCollect = ''
        if (this.collectFlag == 'Y') {
          isCollect = 'N'
        } else {
          isCollect = 'Y'
        }
        let params = {
          "newsId": this.newsId,
          "action": isCollect,
          "sessionKey": this.getSessionKey,
        }
        let url = api.serviceUrl + this.getSessionKey
        const favoritDatas = await http.post(url, api.serviceNewsFavorit, params)
        if (favoritDatas.data.code === api.ERR_OK) {
          if (isCollect == 'Y') {
            Toast({
              duration: 1000,
              message: '收藏成功'
            })
          } else {
            Toast({
              duration: 1000,
              message: '取消收藏'
            })
          }
        } else {
          Toast({
            duration: 1000,
            message: favoritDatas.data.msg
          })
        }
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
    position: fixed
    bottom: 0
    width: 100%
    height: 40px
    overflow: hidden
    background: #f2f2f2
    z-index: 111
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
        flex: 0 0 120px
        width: 120px
        text-align: center
        // margin-right: -10px
        display: flex
        justify-content: space-between
        .icon-word, .icon-praise, .icon-favorites_empty, .icon-five_star
          // margin-left: 5px
          padding: 0 10px
          line-height: 40px
          font-size: $font-size-medium-x
          border: none
          outline: none
          background: transparent
        .icon-praise
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
      width: 120px
      right: 0
      margin-right: 10px
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
