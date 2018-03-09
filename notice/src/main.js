import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import Vant from 'vant'
import 'vant/lib/vant-css/index.css'

import 'common/stylus/index.styl'

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
