<template>
  <div class="loading">
    <img width="30" height="30" src="./loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: '请稍候，正在载入...'
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .loading
    position: absolute
    top: 30%
    left: 50%
    width: 100%
    transform: translate(-50%, -50%)
    text-align: center
    .desc
      line-height: 20px
      font-size: 12px
      color: #fff
</style>
