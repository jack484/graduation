<template>
  <div ref="homePage" class="home-page">
    <div class="container">
      <search @onSearch="onSearch" @showHome="showHome" :isShowActive="isShowActive"></search>
      <transition name="navbox">
        <div class="category-wrapp" v-show="isShowCategory">
          <div class="category">
            <h1 class="title">分类</h1>
            <ul class="category-ul">
              <li class="category-list" v-for="(item, index) in categoryList" @click="selectCategory(index, item.id)">
                <span class="category-name" :class="{'action': isAction==index}">{{item.categoryName}}</span>
              </li>
            </ul>
          </div>
          <div class="category-hid" @click="hidCategory"></div>
        </div>
      </transition>
      <scroll ref="scroll" class="scroll"
        :data="albumsList"
        :mouseWheel="mouseWheel"
        :pullup="pullup"
        @scrollToEnd="loadMore" v-if="albumsList.length>0">
      <ul class="photo-ul">
        <router-link :to="{path: '/photoList', query: {albumsName: item.albumsname, albumsDesc: item.albumsdesc, imageCount: item.imagecount, oImgUrl: item.homeimage, index: index}}" tag="li" class="photo-list" v-for="(item, index) in albumsList" :key="item.id">
          <div class="list-img">
            <img :src="imgUrl + item.homeimage" v-if="item.homeimage">
            <img v-else src="./empty.jpg">
          </div>
          <div class="list-content border-1px">
            <h1 class="title">{{item.albumsname}}</h1>
            <div class="content">
              <span class="text">{{item.albumsdesc}}</span>
              <span class="icon"><i class="icon-right"></i></span>
            </div>
            <span class="page-num">{{item.imagecount}} 张照片</span>
          </div>
        </router-link>
        <loading v-show="hasMore" title=""></loading>
        <div class="empty-alert" v-show="noMore">已全部加载完</div>
      </ul>
      </scroll>
      <div v-else class="empty">
        <span class="text" v-show="!isShowLoading">暂无相册</span>
      </div>
      <div class="loading-container" v-show="isShowLoading">
        <loading ></loading>
      </div>
    </div>
    <transition name="router-slid" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Search from 'base/search/search'
  import {formatDate} from 'common/js/date'
  import {getUrlKey} from 'common/js/store'
  import *as api from 'api/api'
  import http from 'api/http'
  import {mapGetters, mapActions} from 'vuex'
  import { Toast } from 'vant'
  import Loading from 'base/loading/loading'

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
        imgUrl: api.imgUrl, // 初始化图片路径
        pageNum: 1, // 页数
        pageSize: 10, // 每页显示的条数
        categoryList: [], // 相册类别
        albumsList: [], // 企业相册列表
        isShowActive: false,
        isAction: false,
        isShowCategory: false,
        currentSessionKey: null,
        mouseWheel: true,
        pullup: true, // 上拉加载更多
        maxPage: null,
        hasMore: false,
        noMore: false,
        isShowLoading: true,
      }
    },
    created() {
      this.currentSessionKey = getUrlKey('s')
      if (this.currentSessionKey != null) {
        this.saveSessionKey(this.currentSessionKey)
      }
    },
    mounted() {
      this.getCategory()
      this.getAlbumsList()
    },
    methods: {
      ...mapActions([
        'saveAlbumsDetailList', 'saveSessionKey'
      ]),
      async getCategory() {
        let url = api.serviceUrl + this.currentSessionKey
        const albumsCategory = await http.post(url, api.serviceCategoryList)
        if (albumsCategory.data.code === api.ERR_OK) {
          let response = albumsCategory.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          this.categoryList = response.categoryList
          this.categoryList.unshift({categoryName: '全部', remarks: '全部',id: '110120'})
        } else {
          Toast({
            duration: 1000,
            message: albumsCategory.data.msg
          })
        }
      },
      async getAlbumsList(categoryId) {
        this.hasMore = true
        this.noMore = false
        let params = {
          "categoryId": categoryId || '',
          "albumsName": '',
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
          "sessionKey": this.currentSessionKey,
        }
        let url = api.serviceUrl + this.currentSessionKey
        const albumsData = await http.post(url, api.serviceAlbumsList, params)
        if (albumsData.data.code === api.ERR_OK) {
          let response = albumsData.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          this.albumsList = response.albumsList.list
          // console.log(response.albumsList)
          this._checkMore(response.albumsList)
          this.maxPage = response.albumsList.maxPage
          let albumsDetailsList = []
          this.albumsList.forEach((list) => {
            albumsDetailsList.push(list.albumsdetailslist)
          })
          // console.log(albumsDetailsList)
          // 将子相册列表详情存入vuex
          this.saveAlbumsDetailList(albumsDetailsList)
          this.isShowLoading = false
        } else {
          this.isShowLoading = false
          Toast({
            duration: 1000,
            message: albumsData.data.msg
          })
        }
      },
      // 上拉加载更多
      async loadMore(categoryId) {
        if (!this.hasMore) {
          return
        }
        if (this.pageNum++ <= this.maxPage) {
          let params = {
            "categoryId": categoryId || '',
            "albumsName": '',
            "pageNum": this.pageNum,
            "pageSize": this.pageSize,
            "sessionKey": this.currentSessionKey,
          }
          let url = api.serviceUrl + this.currentSessionKey
          const albumsData = await http.post(url, api.serviceAlbumsList, params)
          if (albumsData.data.code === api.ERR_OK) {
            let response = albumsData.data.data
            response = response && response === '[]' ? [] :JSON.parse(response)
            this.albumsList = this.albumsList.concat(response.albumsList.list)
            this._checkMore(response.albumsList)
            let albumsDetailsList = []
            this.albumsList.forEach((list) => {
              albumsDetailsList.push(list.albumsdetailslist)
            })
            // 将子相册列表详情存入vuex
            this.saveAlbumsDetailList(albumsDetailsList)
            this.isShowLoading = false
          } else {
            this.isShowLoading = false
            Toast({
              duration: 1000,
              message: albumsData.data.msg
            })
          }
        }
      },
      _checkMore(data) {
        // console.log(data)
        // console.log(data.pageSize) // 每页显示的条数
        // console.log(data.pageNo) // 当前页数
        // console.log(data.totalCount) // 总条数
        // console.log(this.pageSize) // 一次获取的条数
        if (!data.list.length || (data.pageNo * this.pageSize) > data.totalCount) {
          this.hasMore = false
          this.noMore = true
        }
      },
      // 选择相册类别
      selectCategory(index, id) {
        this.pageNum = 1
        this.isAction = index
        if (id === '110120') {
          let allId = ''
          this.getAlbumsList(allId)
        } else {
          this.getAlbumsList(id)
        }
        this.isShowCategory = false
        this.isShowActive = !this.isShowActive
      },
      async onSearch(searchValue) {
        this.pageNum = 1
        this.hasMore = true
        let params = {
          "categoryId": '',
          "albumsName": searchValue,
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
          "sessionKey": this.currentSessionKey
        }
        let url = api.serviceUrl + this.currentSessionKey
        const albumsData = await http.post(url, api.serviceAlbumsList, params)
        if (albumsData.data.code === api.ERR_OK) {
          let response = albumsData.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          this.albumsList = response.albumsList.list
          let albumsDetailsList = []
          this.albumsList.forEach((list) => {
            albumsDetailsList.push(list.albumsdetailslist)
          })
          // // 将子相册列表详情存入vuex
          this.saveAlbumsDetailList(albumsDetailsList)
          this._checkMore(response.albumsList)
          this.isShowLoading = false
        } else {
          this.isShowLoading = false
          Toast({
            duration: 1000,
            message: albumsData.data.msg
          })
        }
      },
      showHome() {
        this.isShowActive = !this.isShowActive
        this.isShowCategory = !this.isShowCategory
      },
      hidCategory() {
        this.isShowActive = !this.isShowActive
        this.isShowCategory = !this.isShowCategory
      }
    },
    components: {
      Scroll,
      Search,
      Loading,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .home-page
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    background: #fff
    overflow: hidden
    .container
      position: absolute
      width: 100%
      min-height: 100%
      .category-wrapp
        position: fixed
        top: 42px
        left: 0
        right: 0
        bottom: 0
        overflow: hidden
        background: rgba(7, 17, 27, .5)
        z-index: 10
        opacity: 1
        transform: translate3d(0, 0, 0)
        .category
          padding: 10px 18px 20px
          background: #fff
          .title
            padding: 10px 0
            line-height: 20px
            font-size: 14px
            color: #999
          .category-ul
            display: flex
            .category-list
              margin-right: 10px
              .category-name
                padding: 5px 8px
                line-height: 20px
                font-size: 14px
                color: #666
                border: 1px solid rgba(7, 17, 27, .1)
                border-radius: 5px
                box-sizing: border-box
              .action
                background: rgb(96, 162, 242)
                color: #fff
                border-color: rgb(96, 162, 242)
        .category-hid
          width: 100%
          height: 80%
        &.navbox-enter-active, &.navbox-leave-active
          transition: all .3s linear
          // transform: translateY(0)
        &.navbox-enter, &.navbox-leave-active
          transform: translate3d(0, -30px, 0)
          opacity: 0
      .scroll
        position: absolute
        top: 42px
        bottom: 0
        left: 0
        right: 0
        background: #fff
        overflow: hidden
        .photo-ul
          margin: 10px 18px
          padding-bottom: 10px
          .photo-list
            display: flex
            margin-bottom: 10px
            .list-img
              flex 0 0 80px
              width: 80px
              margin-right: 8px
              img
                width: 100%
                max-height: 80px
                margin-top: 10px
            .list-content
              flex: 1
              padding: 10px 0
              border-1px(rgba(7, 17, 27, .1))
              .title
                line-height: 20px
                font-size: $font-size-medium-x
                color: $color-highlight-background
              .content
                display: flex
                justify-content: space-between
                align-items: center
                margin-top: 5px
                margin-bottom: 5px
                .text
                  width: 95%
                  line-height: 18px
                  font-size: $font-size-medium
                  color: $color-dialog-background-x
                  overflow: hidden
                  display: -webkit-box // 多行文本溢出省略
                  -webkit-box-orient: vertical
                  -webkit-line-clamp: 1
                .icon
                  line-height: 18px
                  font-size: $font-size-medium
                  color: $color-dialog-background-x
              .page-num
                line-height: 16px
                font-size: $font-size-small
                color: $color-dialog-background-x
          .empty-alert
            text-align: center
            line-height: 30px
            // padding-bottom: 10px
            font-size: $font-size-small
            color: $color-dialog-background-x
      .empty
        width: 100%
        height: 100%
        margin-top: 80px
        text-align: center
        .text
          font-size: 12px
          line-height: 20px
          color: #999
    .router-slid-enter-active, .router-slid-leave-active
      transition: all .5s
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(30px, 0px, 0)
      opacity: 0
</style>
