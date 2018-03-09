<template>
  <div class="search-page">
    <div class="search border-1px">
      <span class="icon"
      @click="showHome"
      :class="{'active': isShowActive}">
        <i class="icon-three_rollers"></i>
      </span>
      <van-search @search="onSearch" class="search-van" placeholder="输入相册名称搜索" v-model="searchValue" />
    </div>
  </div>
</template>

<script>

  export default {
    name: 'search',
    data() {
      return {
        searchValue: null,
      }
    },
    props: {
      // 接受父组件传过来的isShowActive值
      isShowActive: {
        type: Boolean,
        default: false,
      }
    },
    beforeDestroy(){ // 销毁定时器
      clearTimeout(this.timer)
    },
    methods: {
      showHome() {
        this.$emit('showHome')
      },
      onSearch() {
        this.$emit('onSearch', this.searchValue)
        this.timer = setTimeout(() => {
          clearTimeout(this.timer)
          this.searchValue = ''
        }, 2000)
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search-page
    width: 100%
    .search
      display: flex
      width: 100%
      border-1px(rgba(7, 17, 27, .2))
      .icon
        flex: 0 0 40px
        width: 40px
        background: $color-background
        text-align: center
        .icon-three_rollers
          font-size: $font-size-large-x
          line-height: 42px
          color: $color-dialog-background-x
      .active
        .icon-three_rollers
          color: rgb(96, 162, 242)
      .search-van
        flex: 1
        padding-left: 0
</style>
