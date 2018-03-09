<template>
  <div id="app">
    <tab></tab>
    <router-view></router-view>
  </div>
</template>

<script>
import Tab from './components/tab/tab'

export default {
  name: 'App',
  components: {
    Tab
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
