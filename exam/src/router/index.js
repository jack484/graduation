import Vue from 'vue'
import Router from 'vue-router'

const home = r => require.ensure([], () => r(require('components/home/home')))
const unExam = r => require.ensure([], () => r(require('components/unExam/unExam')))
const finishExam = r => require.ensure([], () => r(require('components/finishExam/finishExam')))
const itemDetail = r => require.ensure([], () => r(require('components/itemDetail/itemDetail')))
const answerList = r => require.ensure([], () => r(require('components/itemDetail/children/answerList')))
const score = r => require.ensure([], () => r(require('components/itemDetail/children/score')))
const scoreItem = r => require.ensure([], () => r(require('components/itemDetail/children/scoreItem')))
const answerItem = r => require.ensure([], () => r(require('components/answerItem/answerItem')))
const answerFull = r => require.ensure([], () => r(require('components/itemDetail/children/answerFull')))


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: home,
      redirect: '/unExam',
      children: [
      	{
      		path: '/unExam',
      		component: unExam,
      		children: [
      			{
      				path: '/itemDetail',
      				component: itemDetail,
      				children: [
      					{path: '/answerList', component: answerList},
                {path: '/score', component: score},
                {path: '/answerFull', component: answerFull},
      				]
      			},
      		]
      	},
      	{path: '/finishExam', component: finishExam},
        {path: '/answerItem', component: answerItem},
        {path: '/scoreItem', component: scoreItem},
      ]
    }
  ]
})
