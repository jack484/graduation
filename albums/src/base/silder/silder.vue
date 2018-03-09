<template>
  <div class="silder-page" @click="hidShowPic" ref="silderPage">
    <div class="page">
    <slide ref="slide"
    :autoPlay="isAutoPlay"
    :loop="isLoop"
    :showDot="isShowDot"
    :interval="interval"
    :threshold="threshold"
    :speed="speed">
      <div class="silder-list" v-for="(item, index) in photoList">
        <img :src="apiImgUrl + item.realpath" >
      </div>
    </slide>
    </div>
  </div>
</template>

<script>
  import *as api from 'api/api'
  import Slide from 'base/slide/slide'

  export default {
    props: {
      photoList: {
        type: Array
      },
      currentIndex: {
        type: Number
      }
    },
    data() {
      return {
        index: this.currentIndex,
        apiImgUrl: api.imgUrl, // 初始化图片路径
        isAutoPlay: false,
        isLoop: false,
        isShowDot: false,
        speed: 400,
        threshold: 0.3,
        interval: 4000,
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.goPage()
      })
    },
    methods: {
      hidShowPic() {
        this.$emit('hidShowPic')
      },
      // 跳到指定图片
      goPage() {
        this.$refs.slide.goToPage(this.currentIndex, 0, 0)
      }
    },
    components: {
     Slide,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .silder-page
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 111
    background: rgba(7, 17, 27, 0.8)
    .page
      // position: absolute
      // top: 50%
      // transform: translateY(-50%)
      .silder-list
        width: 100%
        img
          width: 100%
</style>
