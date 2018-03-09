<template>
  <div class="news">
    <search @onSearch="onSearch" @showHome="showHome" :isShowActive="isShowActive"></search>
    <div class="tab-bar">
      <!-- 导航栏 -->
      <div class="nav" v-if="isShowNav" ref="classify">
        <van-tabs @click="showCategoryList" :active="currentIndex">
          <van-tab v-for="item in categoryList" :title="item.categoryName" :key="item.id">
          </van-tab>
        </van-tabs>
      </div>
      <div v-else class="classify" ref="classify">
        <span>分类</span>
      </div>
      <div class="nav-right border-1px">
        <span ref="iconDown" class="pull-down" @click="selectList"><i class="icon-down"></i></span>
      </div>
    </div>
    <!-- 右侧下拉导航栏 -->
    <transition name="navbox">
      <div class="select-list" v-show="isShowSelect">
        <ul class="select-ul">
          <li class="select-li border-1px"
            ref="selectLi"
            v-for="(item, index) in categoryList"
            @click="showSelectCategory(index, item.id)"
            :class="{'active': selectActive == index}">
            <span class="title">{{item.categoryName}}</span>
          </li>
        </ul>
      </div>
    </transition>
    <!-- 内容区 -->
    <scroll v-if="newsSkin.skinCode == 'two'" ref="scroll" class="news-content"
      :data="newsContentList"
      :pullup="pullup"
      :beforeScroll="beforeScroll"
      :pulldown="pulldown"
      @pulldown="fetchNewsList"
      @scrollToEnd="loadMore"
      :mouseWheel="mouseWheel"
      >
      <div>
        <ul class="news-content-ul" v-if="newsContentList && newsContentList.length>0">
          <router-link :to="{path: '/newsDetail', query: {index: index, newsid: item.newsid}}" tag="li" class="news-content-li" v-for="(item,index) in newsContentList" :key="index">
            <div class="news-img">
              <img width="70" height="70" v-lazy="imgUrl + item.coverimageurl" v-if="item.coverimageurl">
              <img class="new-img" v-else src="./logo.jpg">
            </div>
            <div class="news-text border-1px">
              <div class="news-title">
                <span class="title">{{item.title}}</span>
              </div>
              <div class="time">
                <span >{{item.publishtime | showTime}}</span>
                <span class="hot" v-if="item.topflag == true">置顶</span>
              </div>
            </div>
          </router-link>
          <loading v-show="hasMore" title=""></loading>
          <div class="empty-alert" v-show="noMore">已全部加载完</div>
        </ul>
        <div v-else class="empty"><span class="text">暂无数据</span></div>
        </div>
    </scroll>
    <scroll ref="scroll" class="template-two"
      v-if="newsSkin.skinCode == 'three'"
      :data="newsContentList"
      :pulldown="pulldown"
      @pulldown="fetchNewsList"
      :pullup="pullup"
      @scrollToEnd="loadMore"
      :mouseWheel="mouseWheel">
      <div>
        <ul class="news-content-ul" v-if="newsContentList && newsContentList.length>0">
          <router-link :to="{path: '/newsDetail', query: {index: index, newsid: item.newsid}}" tag="li" class="news-content-li border-1px" v-for="(item,index) in newsContentList" :key="index">
            <div class="date-month" v-if="item.publishtime != null">
              <p class="month">{{_showTime(item.publishtime).substring(0, 2)}}月</p>
              <p class="date">{{_showTime(item.publishtime).substring(3, 5)}}</p>
            </div>
            <div class="content">
              <h1 class="title">{{item.title}} | {{item.categoryname}}</h1>
              <div class="other">
                <span class="summary">{{item.summary}}</span>
                <span class="hot" v-if="item.topflag == true">置顶</span>
              </div>
            </div>
          </router-link>
          <loading v-show="hasMore" title=""></loading>
          <div class="empty-alert" v-show="noMore">已全部加载完</div>
        </ul>
        <div v-else class="empty"><span class="text">暂无数据</span></div>
      </div>
    </scroll>
    <scroll ref="scroll" class="template-three"
      v-if="newsSkin.skinCode == 'four'"
      :data="newsContentList"
      :pulldown="pulldown"
      @pulldown="fetchNewsList"
      :pullup="pullup"
      @scrollToEnd="loadMore"
      :mouseWheel="mouseWheel">
      <div>
        <ul class="news-content-ul" v-if="newsContentList && newsContentList.length>0">
          <router-link :to="{path: '/newsDetail', query: {index: index, newsid: item.newsid}}" tag="li" class="news-content-li border-1px" v-for="(item,index) in newsContentList" :key="index">
            <div class="date-month" v-if="item.publishtime">
              <p class="month">{{_showTime(item.publishtime).substring(0, 2)}}月</p>
              <p class="date">{{_showTime(item.publishtime).substring(3, 5)}}</p>
            </div>
            <div class="content">
              <img class="cover-img" width="60" height="60" v-lazy="imgUrl + item.coverimageurl">
              <div class="desc">
                <h1 class="title">{{item.title}}</h1>
                <div class="other">
                  <span class="text">{{item.categoryname}}</span>
                  <span class="hot" v-if="item.topflag == true">置顶</span>
                </div>
              </div>
            </div>
          </router-link>
          <loading v-show="hasMore" title=""></loading>
          <div class="empty-alert" v-show="noMore">已全部加载完成...</div>
        </ul>
        <div v-else class="empty"><span class="text">暂无数据</span></div>
      </div>
    </scroll>
    <!-- 发布公告栏 -->
    <!-- <div class="issue" v-if="showIssue" >
      <span class="icon" @click="templateZero"><i class="icon-notebook">0</i></span>
      <span class="text" @click="chageTemplate">发布公告</span>
    </div> -->
    <!-- 点击左上角的三杠,显示个人信息 -->
    <transition name="userInfo">
      <div class="user-info" v-show="showUserInfo">
        <div class="info-wrapp">
          <div class="head-info">
            <div class="background">
              <img :src="currentUserInfo.avatar" alt="" v-if="currentUserInfo.avatar != null && currentUserInfo.avatar">
              <img v-else src="./logo.jpg">
            </div>
            <div class="head-content">
              <div class="head-img">
                <img :src="currentUserInfo.avatar" alt="" v-if="currentUserInfo.avatar != null && currentUserInfo.avatar">
                <img v-else src="./logo.jpg">
              </div>
              <h1 class="title" v-if="currentUserInfo.name">{{currentUserInfo.name}}</h1>
              <p class="text" v-if="currentUserInfo.masterDepartment != null && currentUserInfo.masterDepartment.name">{{currentUserInfo.masterDepartment.name}}</p>
            </div>
          </div>
          <div class="info-container">
            <ul class="info-ul">
              <li class="info-li">
                <span class="icon"><i class="icon-all"></i></span>
                <span class="text">全部</span>
              </li>
              <li class="info-li" @click="goReplyItem">
                <span class="icon" ><i class="icon-at"></i></span>
                <span class="text">回复我的</span>
              </li>
              <li class="info-li" @click="goEachDetail(serviceMyComment)">
                <span class="icon"><i class="icon-comment"></i></span>
                <span class="text">我评论的</span>
              </li>
              <li class="info-li" @click="goEachDetail(serviceMyFavorit)">
                <span class="icon"><i class="icon-favorites"></i></span>
                <span class="text">我收藏的</span>
              </li>
              <li class="info-li" @click="goEachDetail(serviceMyPraise)">
                <span class="icon"><i class="icon-praise"></i></span>
                <span class="text">我点赞的</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="hidden-info" @click="hidUserInfo"></div>
      </div>
    </transition>
    <div class="loading-container" v-show="isShowLoading">
      <loading ></loading>
    </div>
    <transition name="router-slid" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
  import Search from 'base/search/search'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import templateOne from 'base/templateStyle/templateOne'
  import templateTwo from 'base/templateStyle/templateTwo'
  import templateThree from 'base/templateStyle/templateThree'
  import { Toast } from 'vant'
  import *as api from 'api/api'
  import http from 'api/http'
  import {formatDate} from 'common/js/date'
  import {getUrlKey} from 'common/js/getSessionKey'
  import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    filters: {
      // 时间格式化过滤器
      showTime(dateTime) {
        if (dateTime) {
          return formatDate(new Date(dateTime *1000), "yyyy-MM-dd")
        } else {
          return ''
        }
      },
    },
    data() {
      return {
        isShowSelect: false,
        showIssue: false, // 是否显示发布公告栏
        isActive: 0, // 当点击导航时，改变字体颜色，默认为全部（0）
        selectActive: '0', // 当点击下拉时，改变字体颜色，默认为空
        categoryList: [], // 新闻导航列表
        pageNum: 1, // 页数
        pageSize: 20, // 每页显示的条数
        maxPage: null, // 总页数
        pageNo: null, // 当前页
        newsList: [], // 新闻列表数据
        newsContentList: [],
        imgUrl: api.imgUrl, // 初始化图片路径
        showCategory: [], // 导航栏需要显示的前3个数据
        selectCategory: [], // 导航栏需要下拉显示的其他数据
        pulldown: true, // 下拉刷新
        pullup: true, // 上拉加载更多
        beforeScroll: false,
        hasMore: false,
        isLoading: false,
        isShowNav: true,
        currentIndex: '0', // 初始化当前index值
        showUserInfo: false, // 是否显示用户信息
        isShowActive: false,
        isShowLoading: true,
        serviceMyComment: api.serviceMyComment, // 初始化我评论的新闻接口
        serviceMyFavorit: api.serviceMyFavorit, // 初始化我收藏的新闻接口
        serviceMyPraise: api.serviceMyPraise, // 初始化我点赞的新闻接口
        currentSessionKey: null,
        currentUserInfo: '', // 当前用户信息
        newsSkin: '', // 新闻模板
        noMore: false,
        mouseWheel: true, // 开启滚轮滚动
      }
    },
    created() {
      this.currentSessionKey = getUrlKey('s')
      if (this.currentSessionKey != null) {
        this.saveSessionKey(this.currentSessionKey)
        // this.SAVE_SESSIONKEY(this.currentSessionKey)
      }
    },
    mounted() {
      this.getCategoryList()
      this.fetchNewsList()
      this.getUserInfo()
    },
    methods: {
      ...mapActions([
        'saveNewsList', 'saveSessionKey',
      ]),
      // 获取导航栏列表
      async getCategoryList() {
        let url = api.serviceUrl + this.currentSessionKey
        const res = await http.post(url, api.serviceNewsList)
        if (res.data.code === api.ERR_OK) {
          let response = res.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          this.categoryList = response.categoryList
          // 将'全部'加到数组开头，成为一个子数组
          this.categoryList.unshift({categoryName: '全部', remarks: '全部',id: '110120'})
          this.newsSkin = response.newsSkin
        } else {
          this.isShowLoading = false
          Toast({
            duration: 1000,
            message: res.data.msg
          })
        }
      },
      // 获取新闻内容数据
      async fetchNewsList(v_categoryId) {
        this.hasMore = true
        this.noMore = false
        let params = {
          "categoryId": v_categoryId || '',
          "title": '',
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
          "sessionKey": this.currentSessionKey,
        }
        let url = api.serviceUrl + this.currentSessionKey
        const newsData = await http.post(url, api.serviceNews, params)
        if (newsData.data.code === api.ERR_OK) {
          let response = newsData.data.data
          response = response && response === '[]' ? [] :JSON.parse(response)
          this.newsList = response.newsList
          // console.log(this.newsList)
          this._checkMore(this.newsList)
          this.newsContentList = this.newsList.list
          this.maxPage = this.newsList.maxPage
          this.pageNo = this.newsList.pageNo
          this.isShowLoading = false
          // 将新闻详情列表存入vuex
          this.saveNewsList(this.newsList.list)
        } else {
          this.isShowLoading = false
          Toast({
            duration: 1000,
            message: newsData.data.msg
          })
        }
      },
      // 上拉加载更多
      async loadMore() {
        if (!this.hasMore) {
          return
        }
        if (this.pageNum++ < this.maxPage) {
          let params = {
            "categoryId": '',
            "title": '',
            "pageNum": this.pageNum,
            "pageSize": this.pageSize,
            "sessionKey": this.currentSessionKey,
          }
          let url = api.serviceUrl + this.currentSessionKey
          const newsData = await http.post(url, api.serviceNews, params)
          if (newsData.data.code === api.ERR_OK) {
            let response = newsData.data.data
            response = response && response === '[]' ? [] :JSON.parse(response)
            let loadList = response.newsList
            this.newsContentList = this.newsContentList.concat(response.newsList.list)
            this._checkMore(loadList)
            // 将新闻详情列表存入vuex
            this.saveNewsList(this.newsContentList)
          } else {
            this.isShowLoading = false
            Toast({
            duration: 1000,
            message: newsData.data.msg
          })
          }
        } else {
          Toast({
            duration: 1000,
            message: '没有更多数据了'
          })
          // return
          // this.pageNum--
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
      // 时间格式化过滤器
      _showTime(dateTime) {
        if (dateTime) {
          return formatDate(new Date(dateTime *1000), "MM月dd")
        } else {
          return ''
        }
      },
      async getUserInfo() {
        let params = {
            "sessionKey": this.currentSessionKey,
          }
          let url = api.serviceUrl + this.currentSessionKey
          const userData = await http.post(url, api.serviceUserInfo, params)
          if (userData.data.code === api.ERR_OK) {
            let response = userData.data.data
            response = response && response === '[]' ? [] :JSON.parse(response)
            this.currentUserInfo = response.currentUser
          } else {
            Toast({
              duration: 1000,
              message: userData.data.msg
            })
          }
      },
      // 导航栏横列滚动
      showCategoryList(index) {
        this.pageNum = 1
        this.isActive = index
        let v_id = this.categoryList[index].id
        if (v_id === '110120') {
          let allId = ''
          this.fetchNewsList(allId)
        } else {
          this.fetchNewsList(v_id)
        }
        this.showUserInfo = false
        this.isShowActive = false
        this.currentIndex = index
        this.isShowSelect = false
      },
      // 下拉导航栏
      showSelectCategory(index, id) {
        this.selectActive = index
        this.pageNum = 1
        if (id === '110120') {
          let allId = ''
          this.fetchNewsList(allId)
        } else {
          this.fetchNewsList(id)
        }

        // 通过当前index值激活对应特定的索引TAB
        this.currentIndex = index
        this.isShowSelect = false
        this.changeStyle()
      },
      // 显示下拉选项
      selectList() {
        this.isShowSelect = !this.isShowSelect
        // 去掉最右边li的右边框线
        for (let i = 0; i < this.$refs.selectLi.length; i++) {
          if ((i+1)%3 == 0) {
            this.$refs.selectLi[i].style.border = 'none'
          }
        }
        this.changeStyle()
      },
      // 导航切换为分类
      changeStyle() {
        if (this.isShowSelect == true) {
          this.isShowNav = false
          this.$refs.iconDown.style.transform = 'rotate(180deg)'
          this.$refs.iconDown.style.transition = 'all .5s'
          this.$refs.iconDown.style.borderLeft = 'none'
          this.$refs.classify.style.borderBottom = '1px solid rgba(7, 17, 27, .1)'
        } else {
          this.isShowNav = true
          this.$refs.iconDown.style.transform = 'rotate(360deg)'
          this.$refs.iconDown.style.borderLeft = '1px solid rgba(7, 17, 27, .1)'
          this.$refs.classify.style.borderBottom = 'none'
        }
      },
      hidSelect() {
        this.isShowSelect = false
      },
      // 点击左上角的三杠,显示个人信息
      showHome() {
        this.showUserInfo = true
        this.isShowActive = true
      },
      hidUserInfo() {
        this.showUserInfo = false
        this.isShowActive = false
      },
      // 点赞收藏评论交互页
      goEachDetail(service) {
        this.showUserInfo = false
        this.isShowActive = false
        this.$router.push({path:'/eachDetail', query: {service: service}})
      },
      // 回复我的
      goReplyItem() {
        this.showUserInfo = false
        this.isShowActive = false
        this.$router.push('replyItem')
      },
      // 搜索
      async onSearch(searchValue) {
        this.pageNum = 1
        this.hasMore = true
        if (searchValue) {
          this.noMore = false
          let params = {
            "categoryId": '',
            "title": searchValue,
            "pageNum": this.pageNum,
            "pageSize": this.pageSize,
            "sessionKey": this.currentSessionKey,
          }
          let url = api.serviceUrl + this.currentSessionKey
          const newsData = await http.post(url, api.serviceNews, params)
          if (newsData.data.code === api.ERR_OK) {
            let response = newsData.data.data
            response = response && response === '[]' ? [] :JSON.parse(response)
            this.newsList = response.newsList
            this._checkMore(this.newsList)
            this.newsContentList = this.newsList.list
            this.isShowLoading = false

            // 将新闻详情列表存入vuex
            this.saveNewsList(this.newsContentList)
          } else {
            Toast({
              duration: 1000,
              message: newsData.data.msg
            })
          }
        } else {
          this.noMore = false
          this.currentIndex = 0
          let allId = ''
          this.fetchNewsList(allId)
        }
      },
    },
    components: {
      Search,
      Scroll,
      Loading,
      templateOne,
      templateTwo,
      templateThree,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .news
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    overflow: hidden
    .tab-bar
      display: flex
      width: 100%
      background: #fff
      .nav-right
        flex: 0 0 50px
        width: 50px
        height: 44px
        box-sizing: border-box
        border-1px(rgba(7, 17, 27, .05))
        // line-height: 40px
        .pull-down
          display: inline-block
          width: 100%
          height: 30px
          margin: 5px 0
          line-height: 35px
          border-left: 1px solid rgba(7, 17, 27, .1)
          text-align: center
          box-sizing: border-box
          .icon-down
            font-size: $font-size-medium-x
            font-weight: bold
            color: $color-dialog-background-x
      .nav
        flex: 1
        text-align: center
        .nav-ul
          display: flex
          width: 100%
          .category-list
            flex: 1
            .title
              display: inline-block
              line-height: 38px
              color: $color-dialog-background-x
              font-size: $font-size-medium
          .active
            border-bottom: 2px solid #1E90FF
            .title
              color: #1E90FF
      .classify
        flex: 1
        text-align: center
        margin-right: -50px
        span
          line-height: 44px
          font-size: $font-size-medium
          color: $color-dialog-background-x
    .news-content
      position: absolute
      top: 86px
      bottom: 0
      width: 100%
      overflow: hidden
      background: #fff
      .news-content-ul
        background: #fff
        padding-bottom: 10px
        .news-content-li
          display: flex
          padding: 10px 18px
          .news-img
            flex: 0 0 70px
            width: 70px
            margin-right: 10px
            img
              width: 100%
              min-height: 65px
          .news-text
            flex: 1
            border-1px(rgba(7, 17, 27, .1))
            .news-title
              margin-top: 5px
              line-height: 24px
              font-size: $font-size-medium
              color: #333
              .title
                margin-right: 5px
                width: 100%
                line-height: 20px
                overflow: hidden
                display: -webkit-box // 多行文本溢出省略
                -webkit-box-orient: vertical
                -webkit-line-clamp: 2
              .category-name
                margin-left: 5px
            .time
              display: flex
              justify-content: space-between
              width: 100%
              position: absolute
              bottom: 5px
              font-size: $font-size-small
              color: $color-dialog-background-x
              .hot
                padding: 2px
                margin-right: 5px
                border-radius: 3px
                background: #1E90FF
                color: #fff
        .empty-alert
          text-align: center
          line-height: 30px
          font-size: $font-size-small
          color: $color-dialog-background-x
      .empty
        position: absolute
        top: 86px
        bottom: 0
        left: 0
        right: 0
        line-height: 100px
        text-align: center
        .text
          width: 100%
          color: $color-dialog-background-x
          font-size: $font-size-small
    .template-three
      position: absolute
      top: 86px
      left: 0
      right: 0
      bottom: 0
      overflow: hidden
      background: #f2f5f7
      .news-content-ul
        width: 100%
        height: 100%
        .news-content-li
          display: flex
          margin: 0 18px 0
          padding: 10px 0
          overflow: hidden
          border-1px(rgba(7, 17, 27, .1))
          &:last-child
            border-none()
          .date-month
            flex: 0 0 40px
            width: 40px
            height: 40px
            margin-top: 5px
            margin-right: 10px
            text-align: center
            background: #4876ff
            border-radius: 50%
            .month
              margin-top: 3px
              line-height: 18px
              font-size: 12px
              color: #fff
            .date
              font-size: 18px
              color: #fff
              font-weight: bold
          .content
            flex: 1
            display: flex
            padding: 5px
            background: #fff
            border-radius: 5px
            box-shadow: 0px 5px 5px rgba(7, 17, 27, .1)
            .cover-img
              flex: 0 0 60px
              width: 60px
              padding: 5px 0
            .desc
              flex: 1
              margin-left: 5px
              position: relative
              .title
                padding: 5px 0
                line-height: 20px
                font-size: 14px
                font-weight: bold
                color: #333
                overflow: hidden
                display: -webkit-box // 多行文本溢出省略
                -webkit-box-orient: vertical
                -webkit-line-clamp: 2
              .other
                display: flex
                justify-content: space-between
                align-items: center
                position: absolute
                margin-left: 5px
                margin-top: 5px
                bottom: 0
                width: 95%
                .text
                  font-size: 12px
                  color: #666
                .hot
                  flex: 0 0 30px
                  width: 30px
                  padding: 2px
                  font-size: 12px
                  border-radius: 3px
                  background: #4876FF
                  color: #fff
                  text-align: center
      .empty
        position: absolute
        top: 86px
        bottom: 0
        left: 0
        right: 0
        line-height: 100px
        text-align: center
        .text
          width: 100%
          color: $color-dialog-background-x
          font-size: $font-size-small
    .template-two
      position: absolute
      top: 86px
      left: 0
      right: 0
      bottom: 0
      overflow: hidden
      .news-content-ul
        width: 100%
        height: 100%
        background: #fff
        .news-content-li
          display: flex
          margin: 0 18px 0
          padding: 10px 0
          // height: 60px
          overflow: hidden
          border-1px(rgba(7, 17, 27, .1))
          &:last-child
            border-none()
          .date-month
            flex: 0 0 50px
            width: 50px
            height: 100%
            tex-align: center
            .month
              margin-top: 13px
              line-height: 20px
              font-size: 14px
              color: #999
            .date
              font-size: 30px
              color: #4876FF
              font-weight: bold
          .content
            flex: 1
            .title
              padding: 10px 0
              line-height: 20px
              font-size: 14px
              font-weight: bold
              color: #333
            .other
              display: flex
              width: 100%
              .summary
                flex: 1
                line-height: 18px
                font-size: 14px
                color: #666
                display: -webkit-box
                -webkit-box-orient: vertical
                -webkit-line-clamp: 1
                overflow: hidden
              .hot
                flex: 0 0 30px
                width: 30px
                padding: 2px
                font-size: 12px
                border-radius: 3px
                background: #4876FF
                color: #fff
                text-align: center
      .empty
        position: absolute
        top: 86px
        bottom: 0
        left: 0
        right: 0
        line-height: 100px
        text-align: center
        .text
          width: 100%
          color: $color-dialog-background-x
          font-size: $font-size-small
    .issue
      position: fixed
      bottom: 0
      width: 100%
      height: 40px
      border-top: 1px solid rgba(7, 17, 27, .1)
      background: #fff
      text-align: center
      .text, .icon
        font-size: $font-size-medium-x
        color: blue
        line-height: 40px
    .select-list
      position: absolute
      top: 86px
      bottom: 0
      width: 100%
      overflow: hidden
      background: $color-background-d
      z-index: 666
      opacity: 1
      transform: translate3d(0, 0, 0)
      &.navbox-enter-active, &.navbox-leave-active
        transition: all .3s linear
      &.navbox-enter, &.navbox-leave-active
        transform: translate3d(0, -30px, 0)
        opacity: 0
      .select-ul
        display: flex
        flex-wrap: wrap
        background: #fff
        .select-li
          flex: 0 0 33.333334%
          width: 33.333334%
          border-right: 1px solid rgba(7, 17, 27, .1)
          box-sizing: border-box
          margin: 8px 0
          .title
            display: block
            font-size: $font-size-medium
            line-height: 35px
            padding: 0 18px
            color: $color-dialog-background-x
            text-align: center
        .active
          // border-bottom: 2px solid #1E90FF
          .title
            color: #1E90FF
    .user-info
      display: flex
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      overflow: hidden
      background: $color-background-d
      z-index: 666
      opacity: 1
      transform: translate3d(0, 0, 0)
      &.userInfo-enter-active, &.userInfo-leave-active
        transition: all .3s linear
        transform: translateX(0)
      &.userInfo-enter, &.userInfo-leave-active
        opacity: 0
        transform: translateX(-100%)
      .info-wrapp
        width: 50%
        height: 100%
        .head-info
          position: relative
          width: 100%
          height: 25%
          overflow: hidden
          background: rgba(7, 17, 27, .05)
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
          .head-content
            margin: 10% 18px
            .head-img
              width: 60px
              height: 60px
              padding-top: 8%
              padding-bottom: 5px
              border-radius: 50%
              img
                width: 100%
                border-radius: 50%
                border: 1px solid #fff
            .title
              padding: 5px 0
              line-height: 20px
              font-size: $font-size-medium-x
              color: #fff
            .text
              line-height: 14px
              font-size: $font-size-small
              color: #fff
        .info-container
          width: 100%
          height: 75%
          background-color: #fff
          .info-ul
            margin: 0 18px
            padding: 10px 0
            .info-li
              display: flex
              width: 100%
              margin-bottom: 10px
              .icon
                flex: 0 0 30px
                width: 30px
                .icon-all, .icon-at, .icon-comment, .icon-favorites, .icon-praise
                  line-height: 30px
                  font-size: $font-size-medium-x
                  color: #1E90FF
              .text
                flex: 1
                line-height: 30px
                font-size: $font-size-medium
                color: $color-highlight-background
      .hidden-info
        width: 50%
        height: 100%
    .loading-container
      position: absolute
      width: 100%
      top: 86px
      bottom: 0
      z-index: 101
      .loading
        position: absolute
        width: 100%
        top: 10%
        left: 50%
        transform: translate(-50%,-50%)
    .router-slid-enter-active, .router-slid-leave-active
      transition: all .3s
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(30px, 0, 0)
      opacity: 0
</style>
