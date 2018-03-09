<template>
  <div class="timer">
    <span>剩余时间：</span><span>{{minutes}}分{{seconds}}秒</span>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    data() {
      return {
        minutes: '',
        seconds: '',
        isShowNoTime: false,
      }
    },
    props: {
      longexam: {
        type: Number,
        default: 0
      }
    },
    mounted() {
      this.countTime()
    },
    methods: {
      ...mapActions([
        'saveCountTime'
      ]),
      // 倒计时
      countTime() {
        let maxTime = this.longexam*60-1
        this._timer = setInterval(() => {
          if (maxTime >= 0) {
            this.minutes = Math.floor(maxTime / 60)
            this.seconds = Math.floor(maxTime % 60)
            --maxTime
            // console.log(this.minutes)
            // console.log(this.seconds)
          } else {
            clearInterval(this._timer)
            this.isShowNoTime = true
            this.saveCountTime(this.isShowNoTime)
          }
        }, 1000)
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .timer
    line-height: 40px
    font-size: $font-size-medium
    color: #FF7F00
</style>
