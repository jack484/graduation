<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  // console.log(BScroll)
  export default {
    props: {
      /**
       * 1 滚动的时候会派发scroll事件，会截流。
       * 2 滚动的时候实时派发scroll事件，不会截流。
       * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
       */
      probeType: {
        type: Number,
        default: 1
      },
      // 点击列表是否派发click事件
      click: {
        type: Boolean,
        default: true
      },
      // 是否派发滚动事件
      listenScroll: {
        type: Boolean,
        default: false
      },
      // 数据列表
      data: {
        type: Array,
        default: null
      },
      // 上拉加载
      pullup: {
        type: Boolean,
        default: false
      },
      // 开启鼠标滚轮事件
      mouseWheel: {
        type: Boolean,
        default: false
      },
      // 是否派发列表滚动开始事件
      beforeScroll: {
        type: Boolean,
        default: false
      },
      // 当数据更新后，刷新scroll的延时
      refreshDelay: {
        type: Number,
        default: 20
      },
      // 是否派发顶部下拉的事件，用于下拉刷新
      pulldown: {
        type: Boolean,
        default: false
      },
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }

        // better-scroll的初始化
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          probeType: 3,// 实时监听滚动的位置
          mouseWheel: this.mouseWheel
        })
        // 获取Y轴动态位置
        this.scroll.on('scroll', (pos) => {
         this.scrollY = Math.abs(Math.round(pos.y))// abs()返回一个绝对值
         // console.log(this.scrollY)
        })

        // 是否派发滚动事件
        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }

        // 上拉加载
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
              // console.log(this.scroll.y)
              // console.log('pullup')
            }
          })
        }

        // 下拉刷新
        if (this.pulldown) {
          this.scroll.on('touchEnd', (pos) => {
            // 下拉动作
            if (pos.y > 50) {
              this.$emit('pulldown')
            }
            // console.log('pulldown')
          })
        }

        // 是否派发列表滚动开始的事件
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      disable() {
        // 代理better-scroll的disable方法
        this.scroll && this.scroll.disable()
      },
      enable() {
        // 代理better-scroll的enable方法
        this.scroll && this.scroll.enable()
      },
      refresh() {
        // 代理better-scroll的refresh方法
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        // 代理better-scroll的scrollTo方法
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      // 用于滚动到指定DOM
      scrollToElement() {
        // 代理better-scroll的scrollToElement方法
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
      data() {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
