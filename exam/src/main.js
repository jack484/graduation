import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/vant-css/index.css'
import WeVue from 'we-vue'
import 'we-vue/lib/style.css'

import 'common/stylus/index.styl'

Vue.use(Vant)
Vue.use(WeVue)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
