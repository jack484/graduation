import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/vant-css/index.css'
import VueLazyload from 'vue-lazyload'

import 'common/stylus/index.styl'

Vue.use(Vant)

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('../static/image/logo.jpg')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
