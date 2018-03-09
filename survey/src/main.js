// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Progress from 'vue-multiple-progress'
import Toast from 'vue2-toast'
import 'vue2-toast/lib/toast.css'
import './common/stylus/index.styl'

Vue.use(Progress)
Vue.use(Toast, {
  defaultType: 'center',
  duration: 1000,
  wordWrap: true,
  width: '200px'
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
