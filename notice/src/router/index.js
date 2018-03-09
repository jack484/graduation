import Vue from 'vue'
import Router from 'vue-router'

const newsNotice = r => require.ensure([], () => r(require('components/newsNotice/newsNotice')))
const birthdayNotice = r => require.ensure([], () => r(require('components/birthdayNotice/birthdayNotice')))
const wishDetail = r => require.ensure([], () => r(require('components/birthdayNotice/children/wishDetail')))
const birthdayBless = r => require.ensure([], () => r(require('components/birthdayNotice/children/birthdayBless')))
const festival = r => require.ensure([], () => r(require('components/festival/festival')))
const staffNotice = r => require.ensure([], () => r(require('components/birthdayNotice/staffNotice')))
const examNotice = r => require.ensure([], () => r(require('components/examNotice/examNotice')))
const staffWish = r => require.ensure([], () => r(require('components/staffWish/staffWish')))
const jobBless = r => require.ensure([], () => r(require('components/staffWish/children/jobBless')))
const examList = r => require.ensure([], () => r(require('components/examNotice/children/examList')))

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/newsNotice',
      name: 'newsNotice',
      component: newsNotice,
      meta: {title: '新闻公告'}
    },
    {
      path: '/birthdayNotice',
      name: 'birthdayNotice',
      component: birthdayNotice,
      meta: {title: '生日祝福'},
      // children: [
      //   {path: 'wishDetail', component: wishDetail},
      // ]
    },
    {
      path: '/wishDetail',
      component: wishDetail
    },
    {
      path: '/birthdayBless',
      component: birthdayBless
    },
    {
      path: '/festival',
      name: 'festival',
      component: festival,
      meta: {title: '节日快乐'}
    },
    {
      path: '/staffNotice',
      name: 'staffNotice',
      component: staffNotice,
      meta: {title: '员工关怀'},
      // children: [
      //   {path: '/staffWish', component: staffWish},
      // ]
    },
    {
      path: '/staffWish',
      component: staffWish,
    },
    {
      path: '/jobBless',
      component: jobBless,
    },
    {
      path: '/examNotice',
      name: 'examNotice',
      component: examNotice,
      meta: {title: '考试预览'}
    },
    {
      path: '/examList',
      component: examList,
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
