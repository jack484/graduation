import Vue from 'vue'
import Router from 'vue-router'

const news = r => require.ensure([], () => r(require('components/news/news')))
const newsDetail = r => require.ensure([], () => r(require('components/news/children/newsDetail')))
const eachDetail = r => require.ensure([], () => r(require('components/news/children/eachDetail')))
const replyItem = r => require.ensure([], () => r(require('components/news/children/replyItem')))

Vue.use(Router)

export default new Router({
  // mode: 'history', // history模式
  routes: [
    {
    	path: '/',
    	component: news, // 首页
    	children: [
    		{path: '/newsDetail', component: newsDetail},
        {path: '/eachDetail', component: eachDetail},
        {path: '/replyItem', component: replyItem}
    	]
    },
  ]
})
