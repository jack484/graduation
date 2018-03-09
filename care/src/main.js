// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import WeVue from 'we-vue'
import 'we-vue/lib/style.css'
import Vant from 'vant'
import 'vant/lib/vant-css/index.css'

import 'common/stylus/index.styl'

Vue.use(WeVue)
Vue.use(Vant)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
