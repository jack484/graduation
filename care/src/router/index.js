import Vue from 'vue'
import Router from 'vue-router'

const care = r => require.ensure([], () => r(require('components/care/care')))
const birthday = r => require.ensure([], () => r(require('components/birthday/birthday')))
const birthdayBless = r => require.ensure([], () => r(require('components/birthday/children/birthdayBless')))
const entryCompany = r => require.ensure([], () => r(require('components/job/entryCompany')))
const myHome = r => require.ensure([], () => r(require('components/care/children/myHome')))
const jobBless = r => require.ensure([], () => r(require('components/job/children/jobBless')))
const setInfo = r => require.ensure([], () => r(require('components/care/children/children/setInfo')))
const wishPage = r => require.ensure([], () => r(require('components/care/children/children/wishPage')))
const myWishDetail = r => require.ensure([], () => r(require('components/birthday/children/myWishDetail')))
const myJobWish = r => require.ensure([], () => r(require('components/job/children/myJobWish')))

Vue.use(Router)

export default new Router({
  // mode: 'history', // history模式
  routes: [
    {
    	path: '/',
    	component: care, // 首页
      redirect: '/birthday',
    	children: [
    		{
          path: '/birthday',
          component: birthday,
          children: [
            {path: '/myWishDetail', component: myWishDetail},
          ]
        },
        {
          path: '/entryCompany',
          component: entryCompany,
          children: [
            {path: '/myJobWish', component: myJobWish},
          ]
        },
        {
          path: '/myHome',
          component: myHome,
          children: [
            {path: '/wishPage', component: wishPage},
          ]
        },
    	]
    },
    {path: '/setInfo', component: setInfo},
    {path: '/birthdayBless', component: birthdayBless},
    {path: '/jobBless', component: jobBless},
  ]
})
