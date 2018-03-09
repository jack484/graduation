<template>
  <div class="tab">
    <router-link class="tab-item"  :to="vote">
      <i class="iconfont icon-vote iconTop"></i>
      <span class="tab-link">投票</span>
    </router-link>
    <router-link class="tab-item" :to="survey">
      <i class="iconfont icon-notebook iconTop"></i>
      <span class="tab-link">调研</span>
    </router-link>
  </div>
</template>
<script>
import {getUrlKey, getUrlParam} from '../../api/api'
export default {
  data() {
    return {
      survey: '',
      vote: ''
    }
  },
  created() {
    let key = getUrlKey('s')
    // let key = getUrlParam('s')
    // console.log(key)
    this.survey = '/survey?s=' + key
    this.vote = '/vote?s=' + key
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .tab
    height:44px
    position:fixed
    bottom: 0
    left:0
    display:flex
    font-size:14px
    width:100%
    align-items:center
    background:#F7F7F7
    z-index:2
    .tab-item
      flex: 1
      text-align:center
      padding:4px
      color: #a9a9a9;
      .iconTop
        display:block
        font-size:20px
      .tab-link
        display:block
        color:darkgray
        font-size:12px
      &.router-link-active
        .tab-link,.iconTop
          color:#60A0F4
</style>
