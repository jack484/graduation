import Vue from 'vue'
import Router from 'vue-router'

const home = r => require.ensure([], () => r(require('components/home/home')))
const photoList = r => require.ensure([], () => r(require('components/photoList/photoList')))
const photoDetail = r => require.ensure([], () => r(require('components/photoList/children/photoDetail')))

Vue.use(Router)

export default new Router({
  // mode: 'history', // history模式
  routes: [
    {
    	path: '/',
    	component: home, // 首页
      children: [
        // {
        //   path: 'photoList',
        //   component: photoList,
        //   children: [
        //     {path: '/photoDetail', component: photoDetail},
        //   ]
        // },
      ]
    },
    {
      path: '/photoList',
      component: photoList,
      children: [
        {path: '/photoDetail', component: photoDetail},
      ]
    },
  ]
})
