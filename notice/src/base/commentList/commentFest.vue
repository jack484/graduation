<template>
  <transition name="commentMove">
  <div class="comment-page">
    <div class="comment-list">
      <div class="input-box">
        <div class="textarea border-1px">
          <textarea rows="8" placeholder="说点什么吧..." v-model.trim="inputValue"></textarea>
        </div>
        <div class="confirm-box border-1px">
          <button class="qqface" @click="showFace">表情</button>
          <span class="input-num">{{inputNum}}</span>
          <div class="confirm">
            <span class="call-off" @click="hidComment">取消</span>
            <span v-if="responeId != null" class="yes" @click="onConfirm">发表</span>
          </div>
        </div>
      </div>
    </div>
    <div class="face-wrapp" v-show="isShowFace">
      <ul class="face-ul">
        <li class="face-list" v-for="face in faceData" @click="checkFace(face.name)">
          <img :src="face.imgUrl">
        </li>
      </ul>
    </div>
  </div>
  </transition>
</template>

<script>
  import { Toast } from 'vant'
  import *as api from 'api/api'
  import http from 'api/http'
  import {mapMutations, mapGetters, mapActions} from 'vuex'

  export default {
    data() {
      return {
        faceData: [
          {name: '[em_1]', imgUrl: require('../../../static/images/faceQQ/1.gif')},
          {name: '[em_2]', imgUrl: require('../../../static/images/faceQQ/2.gif')},
          {name: '[em_3]', imgUrl: require('../../../static/images/faceQQ/3.gif')},
          {name: '[em_4]', imgUrl: require('../../../static/images/faceQQ/4.gif')},
          {name: '[em_5]', imgUrl: require('../../../static/images/faceQQ/5.gif')},
          {name: '[em_6]', imgUrl: require('../../../static/images/faceQQ/6.gif')},
          {name: '[em_7]', imgUrl: require('../../../static/images/faceQQ/7.gif')},
          {name: '[em_8]', imgUrl: require('../../../static/images/faceQQ/8.gif')},
          {name: '[em_9]', imgUrl: require('../../../static/images/faceQQ/9.gif')},
          {name: '[em_10]', imgUrl: require('../../../static/images/faceQQ/10.gif')},
          {name: '[em_11]', imgUrl: require('../../../static/images/faceQQ/11.gif')},
          {name: '[em_12]', imgUrl: require('../../../static/images/faceQQ/12.gif')},
          {name: '[em_13]', imgUrl: require('../../../static/images/faceQQ/13.gif')},
          {name: '[em_14]', imgUrl: require('../../../static/images/faceQQ/14.gif')},
          {name: '[em_15]', imgUrl: require('../../../static/images/faceQQ/15.gif')},
          {name: '[em_16]', imgUrl: require('../../../static/images/faceQQ/16.gif')},
          {name: '[em_17]', imgUrl: require('../../../static/images/faceQQ/17.gif')},
          {name: '[em_18]', imgUrl: require('../../../static/images/faceQQ/18.gif')},
          {name: '[em_19]', imgUrl: require('../../../static/images/faceQQ/19.gif')},
          {name: '[em_20]', imgUrl: require('../../../static/images/faceQQ/20.gif')},
          {name: '[em_21]', imgUrl: require('../../../static/images/faceQQ/21.gif')},
          {name: '[em_22]', imgUrl: require('../../../static/images/faceQQ/22.gif')},
          {name: '[em_23]', imgUrl: require('../../../static/images/faceQQ/23.gif')},
          {name: '[em_24]', imgUrl: require('../../../static/images/faceQQ/24.gif')},
          {name: '[em_25]', imgUrl: require('../../../static/images/faceQQ/25.gif')},
          {name: '[em_26]', imgUrl: require('../../../static/images/faceQQ/26.gif')},
          {name: '[em_27]', imgUrl: require('../../../static/images/faceQQ/27.gif')},
          {name: '[em_28]', imgUrl: require('../../../static/images/faceQQ/28.gif')},
          {name: '[em_29]', imgUrl: require('../../../static/images/faceQQ/29.gif')},
          {name: '[em_30]', imgUrl: require('../../../static/images/faceQQ/30.gif')},
          {name: '[em_31]', imgUrl: require('../../../static/images/faceQQ/31.gif')},
          {name: '[em_32]', imgUrl: require('../../../static/images/faceQQ/32.gif')},
          {name: '[em_33]', imgUrl: require('../../../static/images/faceQQ/33.gif')},
          {name: '[em_34]', imgUrl: require('../../../static/images/faceQQ/34.gif')},
          {name: '[em_35]', imgUrl: require('../../../static/images/faceQQ/35.gif')},
          {name: '[em_36]', imgUrl: require('../../../static/images/faceQQ/36.gif')},
          {name: '[em_37]', imgUrl: require('../../../static/images/faceQQ/37.gif')},
          {name: '[em_38]', imgUrl: require('../../../static/images/faceQQ/38.gif')},
          {name: '[em_39]', imgUrl: require('../../../static/images/faceQQ/39.gif')},
          {name: '[em_40]', imgUrl: require('../../../static/images/faceQQ/40.gif')},
          {name: '[em_41]', imgUrl: require('../../../static/images/faceQQ/41.gif')},
          {name: '[em_42]', imgUrl: require('../../../static/images/faceQQ/42.gif')},
          {name: '[em_43]', imgUrl: require('../../../static/images/faceQQ/43.gif')},
          {name: '[em_44]', imgUrl: require('../../../static/images/faceQQ/44.gif')},
          {name: '[em_45]', imgUrl: require('../../../static/images/faceQQ/45.gif')},
          {name: '[em_46]', imgUrl: require('../../../static/images/faceQQ/46.gif')},
          {name: '[em_47]', imgUrl: require('../../../static/images/faceQQ/47.gif')},
          {name: '[em_48]', imgUrl: require('../../../static/images/faceQQ/48.gif')},
          {name: '[em_49]', imgUrl: require('../../../static/images/faceQQ/49.gif')},
          {name: '[em_50]', imgUrl: require('../../../static/images/faceQQ/50.gif')},
          {name: '[em_51]', imgUrl: require('../../../static/images/faceQQ/51.gif')},
          {name: '[em_52]', imgUrl: require('../../../static/images/faceQQ/52.gif')},
          {name: '[em_53]', imgUrl: require('../../../static/images/faceQQ/53.gif')},
          {name: '[em_54]', imgUrl: require('../../../static/images/faceQQ/54.gif')},
          {name: '[em_55]', imgUrl: require('../../../static/images/faceQQ/55.gif')},
          {name: '[em_56]', imgUrl: require('../../../static/images/faceQQ/56.gif')},
          {name: '[em_57]', imgUrl: require('../../../static/images/faceQQ/57.gif')},
          {name: '[em_58]', imgUrl: require('../../../static/images/faceQQ/58.gif')},
          {name: '[em_59]', imgUrl: require('../../../static/images/faceQQ/59.gif')},
          {name: '[em_60]', imgUrl: require('../../../static/images/faceQQ/60.gif')},
          {name: '[em_61]', imgUrl: require('../../../static/images/faceQQ/61.gif')},
          {name: '[em_62]', imgUrl: require('../../../static/images/faceQQ/62.gif')},
          {name: '[em_63]', imgUrl: require('../../../static/images/faceQQ/63.gif')},
          {name: '[em_64]', imgUrl: require('../../../static/images/faceQQ/64.gif')},
          {name: '[em_65]', imgUrl: require('../../../static/images/faceQQ/65.gif')},
          {name: '[em_66]', imgUrl: require('../../../static/images/faceQQ/66.gif')},
          {name: '[em_67]', imgUrl: require('../../../static/images/faceQQ/67.gif')},
          {name: '[em_68]', imgUrl: require('../../../static/images/faceQQ/68.gif')},
          {name: '[em_69]', imgUrl: require('../../../static/images/faceQQ/69.gif')},
          {name: '[em_70]', imgUrl: require('../../../static/images/faceQQ/70.gif')},
          {name: '[em_71]', imgUrl: require('../../../static/images/faceQQ/71.gif')},
          {name: '[em_72]', imgUrl: require('../../../static/images/faceQQ/72.gif')},
          {name: '[em_73]', imgUrl: require('../../../static/images/faceQQ/73.gif')},
          {name: '[em_74]', imgUrl: require('../../../static/images/faceQQ/74.gif')},
          {name: '[em_75]', imgUrl: require('../../../static/images/faceQQ/75.gif')},
        ],
        inputValue: '',
        inputNum: 200,
        responeId: null,
        newsDetailId: null,
        isShowFace: false,
      }
    },
    props: {
      newsId: {
        type: String,
        default: ''
      },
    },
    computed: {
      ...mapGetters([
        'getResponseId', 'getFestivalId', 'getSessionKey'
      ])
    },
    beforeDestroy(){ // 销毁定时器
      clearTimeout(this.timer)
      clearTimeout(this._timer)
    },
    mounted() {
      this.fetchResponseId()
    },
    methods: {
      ...mapMutations([
        'CLOSE_RESPONSEID', 'CLOSE_NEWSID'
      ]),
      fetchResponseId() {
        if (this.getResponseId) {
          this.responeId = this.getResponseId
        }
      },
      showFace() {
        this.isShowFace = !this.isShowFace
      },
      checkFace(_name) {
        this.inputValue += _name
        this.isShowFace = false
      },
      showHome() {
        this.$emit('showHome')
      },
      hidComment() {
        this.CLOSE_RESPONSEID()
        this.CLOSE_NEWSID()
        // console.log(this.responeId)
        this.$emit('hidComment')
      },
      async onConfirm() {
        if (!this.inputValue) {
          Toast('尚未写评论')
          return
        }

        let params = {
          "festivalId": this.getFestivalId,
          "replyContent": this.inputValue,
          "festivalResponseId": this.responeId,
          "sessionKey": this.getSessionKey,
        }
        let url = api.serviceUrl + this.getSessionKey
        const commentData = await http.post(url, api.serviceFestReply, params)
        // console.log(commentData)
        if (commentData.data.code === api.ERR_OK) {
          Toast({
            duration: 1000,
            message: '评论成功'
          })
          this.inputValue = ''
          this.CLOSE_RESPONSEID()
        } else {
          Toast({
            duration: 1000,
            message: commentData.data.msg
          })
        }
        this.timer = setTimeout(() => {
          this.$emit('onConfirm')
        }, 1000)
      },
    },
    watch: {
      inputValue: function() {
        if (this.inputValue) {
          let num = this.inputValue.length
          this.inputNum = 200-num
        } else {
          this.inputNum = 200
        }
      },
      getResponseId: function(nowId) {
        // console.log(nowId)
        this.responeId = nowId
        // console.log(this.responeId)
      },
      getNewsId: function(nowId) {
        // console.log(nowId)
        this.newsDetailId = nowId
        // console.log(this.newsDetailId)
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .comment-page
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    background: #fff
    z-index: 166
    opacity: 1
    transform: translate3d(0, 0, 0)
    .input-box
      position: relative
      width: 100%
      height: 100%
      margin-top: 35px
      .textarea
        border-1px(rgba(7, 17, 27, .1))
        & > textarea
          width: 100%
          padding: 15px
          font-size: 14px
          line-height: 20px
          color: #666
          border: none
          box-sizing: border-box
          resize: none
          outline: none
      .confirm-box
        display: flex
        border-1px(rgba(7, 17, 27, .1))
        .confirm
          flex: 0 0 140px
          width: 140px
          display: flex
          padding: 5px
          font-size: 14px
          line-height: 18px
          text-align: center
          .call-off
            flex: 1
            margin-right: 10px
            padding: 5px
            border: 1px solid rgba(7, 17, 27, .1)
            color: #999
            border-radius: 5px
          .yes
            flex: 1
            margin-right: 10px
            padding: 5px
            border: 1px solid #4876FF
            background: #4876FF
            color: #fff
            border-radius: 5px
        .input-num
          flex: 1
          text-align: right
          line-height: 40px
          margin-right: 10px
          font-size: 14px
          color: #999
        .qqface
          flex: 0 0 50px
          width: 50px
          line-height: 30px
          padding: 5px
          font-size: 14px
          color: #666
          text-align: center
          border: none
          outline: none
          background: transparent
    .face-wrapp
      position: absolute
      width: 300px
      margin-left: 10px
      z-index: 1011
      .face-ul
        display: flex
        flex-wrap: wrap
        align-content: space-between
        border: 1px solid rgba(7, 17, 27, .1)
        padding: 5px
        border-radius: 5px
        box-shadow: 0 5px 5px rgba(7, 17, 27, .3)
    &.commentMove-enter-active, &.commentMove-leave-active
      transition: all .5s linear
      transform: translateY(0)
    &.commentMove-enter, &.commentMove-leave-active
      transform: translateY(100%)
      // transform: translate3d(0, 30px, 0)
      opacity: 0
</style>
