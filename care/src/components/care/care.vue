<template>
  <div class="care">
    <div class="care-tab">
      <ul class="tab">
        <router-link tag="li" to="/birthday" class="tab-item">
          <span class="icon"><i class="icon-birthday"></i></span>
          <span class="text">生日榜单</span>
        </router-link>
        <router-link tag="li" to="/entryCompany" class="tab-item">
          <span class="icon"><i class="icon-entry_company"></i></span>
          <span class="text">入职榜单</span>
        </router-link>
        <router-link tag="li" to="myHome" class="tab-item">
          <span class="icon"><i class="icon-me"></i></span>
          <span class="text">我</span>
        </router-link>
      </ul>
    </div>
    <!-- <transition name="router-slid" mode="out-in"> -->
      <router-view/>
    <!-- </transition> -->
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'

  export default {
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .care
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    overflow: hidden
    background: #fff
    .care-tab
      position: fixed
      bottom: 0
      width: 100%
      background: #fcfcfc
      .tab
        display: flex
        width: 100%
        height: 45px
        .tab-item
          flex: 1
          text-align: center
          .icon
            display: block
            margin-top: 3px
            .icon-birthday, .icon-me, .icon-entry_company
              font-size: 24px
              color: $color-dialog-background-x
          .text
            font-size: $font-size-small
            color: $color-dialog-background-x
          &.router-link-active
            .text
              color: #00f
            .icon
              .icon-birthday, .icon-me, .icon-entry_company
                color: #00f
    .router-slid-enter-active, .router-slid-leave-active
      transition: all 0.3s
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(30px, 0, 0)
      opacity: 0
</style>
