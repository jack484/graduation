<template>
  <div class="exam">
    <div class="exam-wrapp">
      <div class="tab border-1px">
        <ul>
          <router-link tag="li" to="/unExam" class="tab-item">
            <span class="text">待考</span>
          </router-link>
          <router-link tag="li" to="/finishExam" class="tab-item">
            <span class="text">已考</span>
          </router-link>
        </ul>
      </div>
    </div>
    <transition name="router-slid" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import {getUrlKey} from 'common/js/date'

  export default {
    data() {
      return {
        currentSessionKey: null,
      }
    },
    created() {
      this.currentSessionKey = getUrlKey('s')
      if (this.currentSessionKey != null) {
        this.saveSessionKey(this.currentSessionKey)
      }
    },
    methods: {
      ...mapActions([
        'saveSessionKey'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .exam
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    .tab
      position: absolute
      top: 0
      width: 100%
      height: 45px
      background: #fff
      border-1px(rgba(7, 17, 27, .1))
      box-sizing: border-box
      & > ul
        display: flex
        margin: 5px 18px
        height: 35px
        border-radius: 5px
        border: 1px solid #1E90FF
        box-sizing: border-box
        .tab-item
          flex: 1
          text-align: center
          line-height: 35px
          border-right: 1px solid #1E90FF
          box-sizing: border-box
          &:last-child
            border: none
          .text
            font-size: $font-size-medium-x
            color: #1E90FF
          &.router-link-active
            background: #1E90FF
            .text
              color: #fff
</style>
