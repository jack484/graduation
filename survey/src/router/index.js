import Vue from 'vue'
import Router from 'vue-router'
import survey from '@/components/survey/survey'
import surveyDetail from '@/components/survey-detail/survey-detail'
import vote from '@/components/vote/vote'
import voteDetail from '@/components/vote-detail/vote-detail'
import voteCount from '@/components/vote-count/vote-count'
import surveyResult from '@/components/survey-result/survey-result'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/survey',
      name: 'survey',
      component: survey,
      meta: {title: '调研'}
    },
    {
      path: '/vote',
      name: 'vote',
      component: vote,
      meta: {title: '投票'}
    },
    {
      path: '/survey-detail',
      component: surveyDetail,
      meta: {title: '调研详情'}
    },
    {
      path: '/vote-detail',
      component: voteDetail,
      meta: {title: '投票详情'}
    },
    {
      path: '/vote-Count',
      component: voteCount,
      meta: {title: '投票统计'}
    },
    {
      path: '/survey-result',
      component: surveyResult,
      meta: {title: '调研结果'}
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
