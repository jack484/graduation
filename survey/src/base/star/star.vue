<template>
  <div class="star-page">
    <span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-list" @click="selectStar(index)" v-model="score"></span>
    <!-- <span v-else v-for="(itemStar,index) in itemStars" :class="itemStar" class="star-list"></span> -->
  </div>
</template>

<script>
const LENGTH = 5
const CLS_ON = 'icon-five_star' // 全星
const CLS_OFF = 'icon-star_gray' // 空星

export default {
  data() {
    return {
      score: ''
    }
  },
  props: {
    answer: {
      type: String,
      default: null
    }
  },
  methods: {
    selectStar(index) {
      this.score = index + 1
      this.$emit('selectStar', this.score) // 将选中的星星数量传回给父组件
    }
  },
  computed: {
    //* 计算显示星星
    itemClasses() {
      let result = [] // 返回的是一个数组,用来遍历输出星星
      if (this.answer) {
        let _answer = this.answer.substr(0, 1)
        let score = Math.floor(_answer * 2) / 2 // 计算所有星星的数量
        let integer = Math.floor(score) // 整数星星判断
        for (let i = 0; i < _answer; i++) { // 整数星星使用on
          result.push(CLS_ON) // 一个整数星星就push一个CLS_ON到数组
        }
        while (result.length < LENGTH) { // 余下的用无星星补全,使用off
          result.push(CLS_OFF)
        }
      } else {
        let score = Math.floor(this.score * 2) / 2 // 计算所有星星的数量
        let integer = Math.floor(score) // 整数星星判断
        for (let i = 0; i < integer; i++) { // 整数星星使用on
          result.push(CLS_ON) // 一个整数星星就push一个CLS_ON到数组
        }
        while (result.length < LENGTH) { // 余下的用无星星补全,使用off
          result.push(CLS_OFF)
        }
      }
      return result
    },
    // 当answer有值时，执行此处
    // itemStars() {
    //   let _answer = ''
    //   if (this.answer) {
    //     _answer = this.answer.substr(0, 1)
    //   }
    //   let result = [] // 返回的是一个数组,用来遍历输出星星
    //   let score = Math.floor(_answer * 2) / 2 // 计算所有星星的数量
    //   let integer = Math.floor(score) // 整数星星判断
    //   for (let i = 0; i < _answer; i++) { // 整数星星使用on
    //     result.push(CLS_ON) // 一个整数星星就push一个CLS_ON到数组
    //   }
    //   while (result.length < LENGTH) { // 余下的用无星星补全,使用off
    //     result.push(CLS_OFF)
    //   }
    //   return result
    // }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"
  .star-page
    display: flex
    width: 100%
    .star-list
      margin-top: 5px
      margin-right: 5px
      font-size: 24px
      line-height: 24px
    .icon-five_star
      color: #EEC900
    .icon-star_gray
      color: #999
</style>
