<template>
  <div id="app">
    <!-- <transition name="router-slid" mode="out-in"> -->
      <router-view/>
    <!-- </transition> -->
  </div>
</template>

<script>
  import {getUrlKey} from 'common/js/store'
  import {mapActions} from 'vuex'

  export default {
    name: 'app',
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
        'saveSessionKey',
      ])
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  #app
    .router-slid-enter-active, .router-slid-leave-active
      transition: all 0.3s
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(30px, 0, 0)
      opacity: 0
</style>
