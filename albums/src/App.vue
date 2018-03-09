<template>
  <div id="app">
    <!-- <transition name="router-slid" mode="out-in"> -->
      <router-view/>
    <!-- </transition> -->
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  #app
    .router-slid-enter-active, .router-slid-leave-active
      transition: all .5s
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(30px, 0, 0)
      opacity: 0
</style>
