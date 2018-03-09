<template>
  <transition name="router-slid" mode="out-in">
    <scroll ref="scroll" class="photo-page"
    :data="getDetailList"
    :listenScroll="listenScroll"
    :mouseWheel="mouseWheel">
      <div class="photo-wrapp">
        <div class="photo-head">
          <div class="head-content">
            <div class="head">
              <h1 class="title">{{albumsName}}</h1>
            </div>
            <div class="desc">
              <span class="text">{{albumsDesc}}</span>
            </div>
            <div class="other">
              <div class="content">
                <p class="line"></p>
                <span class="text">{{imageCount}} 张照片</span>
                <p class="line"></p>
              </div>
            </div>
          </div>
          <div class="background">
            <img :src="oImgUrl" v-if="homeImage">
            <img v-else src="../home/empty.jpg">
          </div>
        </div>
        <div class="photo-container">
          <ul class="list-ul">
            <router-link :to="{path: '/photoDetail', query: {index: index, albumsId: item.albumsId, albumsDetailId: item.albumsDetailId}}"  tag="li" class="list" v-for="(item, index) in albumsList" :key="item.id">
              <div class="list-img">
                <img :src="apiImgUrl + item.realpath" width="100%">
              </div>
              <div class="list-content">
                <div class="reply">
                  <i class="icon-word_full"></i><span class="text"> {{item.replyNum}}</span>
                </div>
                <div class="praise">
                  <i class="icon-praise"></i><span class="text"> {{item.praiseNum}}</span>
                </div>
              </div>
            </router-link>
          </ul>
        </div>
      </div>
      <transition name="router-slid" mode="out-in">
        <router-view/>
      </transition>
    </scroll>
  </transition>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import {formatDate} from 'common/js/date'
  import *as api from 'api/api'
  import http from 'api/http'
  import {mapGetters, mapActions} from 'vuex'
  import {getUrlKey} from 'common/js/getSessionKey'

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
        albumsName: null,
        albumsDesc: null,
        imageCount: null,
        homeImage: null,
        oImgUrl: null,
        v_index: null,
        listenScroll: true,
        albumsList: [], // 子相册列表
        apiImgUrl: api.imgUrl, // 初始化图片路径
        mouseWheel: true,
        currentSessionKey: null,
        currentAlbumsId: '',
      }
    },
    created() {
      this.albumsName = this.$route.query.albumsName
      this.albumsDesc = this.$route.query.albumsDesc
      this.imageCount = this.$route.query.imageCount
      this.homeImage = this.$route.query.oImgUrl
      this.oImgUrl = api.imgUrl + this.homeImage
      this.v_index = this.$route.query.index

      this.currentAlbumsId = getUrlKey('albumsId')
      this.currentSessionKey = getUrlKey('s')
      // console.log(this.currentAlbumsId)
      // console.log(this.currentSessionKey)
      if (this.currentSessionKey != null) {
        this.saveSessionKey(this.currentSessionKey)
      }
    },
    computed: {
      ...mapGetters([
        'getDetailList'
      ])
    },
    mounted() {
      if (this.getDetailList.length>0) {
        // console.log('vuex')
        this.fetchDetailList()
      } else {
        // console.log('axios')
        this.getData()
      }
    },
    methods: {
      ...mapActions([
        'savePhotoList', 'saveSessionKey'
      ]),
      fetchDetailList() {
        if (this.getDetailList) {
          this.albumsList = this.getDetailList[this.v_index]

          // 将相册详情存入vux
          this.savePhotoList(this.albumsList)
        }
      },
      async getData() {
        let params = {
          "albumsId": this.currentAlbumsId,
          "sessionKey": this.currentSessionKey,
        }
        let url = api.serviceUrl + this.currentSessionKey
        const albumsData = await http.post(url, api.serviceList, params)
        if (albumsData.data.code === api.ERR_OK) {
          let response = albumsData.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          this.albumsName = response.albumsData.albumsName
          this.albumsDesc = response.albumsData.albumsDesc
          this.imageCount = response.imageCount
          this.homeImage = response.homeImage
          this.oImgUrl = api.imgUrl + this.homeImage
          this.albumsList = response.albumsDetailsList
          // console.log(this.albumsList)
          // 将子相册列表详情存入vuex
          this.savePhotoList(this.albumsList)
        } else {
          Toast({
            duration: 1000,
            message: albumsData.data.msg
          })
        }
      },
      goPhotoDetail() {
        this.$router.push('/photoDetail')
      },
    },
    watch: {
      getDetailList: function(value) {
        this.albumsList = value
      }
    },
    components: {
      Scroll,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .photo-page
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    background: #fff
    overflow: hidden
    // z-index: 2
    .photo-wrapp
      .photo-head
        position: relative
        width: 100%
        // height: 30%
        height: 200px
        overflow: hidden
        .background
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
          z-index: -1
          filter: blur(8px) // 滤镜设置为高斯模糊(blur)
          img
            width: 100%
            height: 100%
        .head-content
          width: 100%
          height: 100%
          color: #fff
          text-shadow: 0 5px 5px rgba(7, 17, 27, .5)
          .head
            position: relative
            height: 40%
            width: 100%
            .title
              position: absolute
              top: 50%
              left: 50%
              transform: translate(-50%, -50%)
              font-size: $font-size-large
              font-weight: bold
          .desc
            margin: 0 20px 20px
            text-align: center
            .text
              display: inline-block
              line-height: 22px
              font-size: $font-size-medium
              // letter-spacing: 2px // 字体间距
              // text-indent: -20px
              // padding: 0 20px
          .other
            position: absolute
            width: 100%
            bottom: 25px
            text-align: center
            .content
              display: flex
              position: absolute;
              top: 50%
              left: 50%
              transform: translate(-50%,-50%)
              .line
                display: inline-block
                width: 30px
                height: 13px
                border-bottom: 1px solid rgba(255, 255, 255, .6)
              .text
                display: inline-block
                line-height: 26px
                margin: 0 10px
                font-size: $font-size-small
      .photo-container
        margin: 10px
        .list-ul
          width: 100%
          column-count: 2 // 设置要显示的列数
          column-gap: 20px // 列间距
          .list
            break-inside: avoid // d为了控制文本块分解成单独的列，以免项目列表的内容跨列，破坏整体的布局
            box-sizing: border-box
            padding-bottom: 10px
            .list-img
              width: 100%
              & > img
                border-radius: 8px
            .list-content
              display: flex
              margin: 0 10px
              .reply, .praise
                color: $color-dialog-background-x
                .icon-word_full
                  font-size: $font-size-medium
                  line-height: 20px
                .icon-praise
                  font-size: $font-size-medium-x
                  margin-left: 8px
                  line-height: 18px
                .text
                  font-size: $font-size-medium-x
                  line-height: 18px
    .router-slid-enter-active, .router-slid-leave-active
      transition: all .5s
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(30px, 0px, 0)
      opacity: 0
    .view-slid-enter-active, .view-slid-leave-active
      transition: all .5s
    .view-slid-enter, .view-slid-leave-active
      transform: translate3d(0, 30px, 0)
      opacity: 0
</style>
