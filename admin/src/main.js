// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import KeenUI from 'keen-ui'

import router from './router'

import '../node_modules/keen-ui/dist/keen-ui.css'

import VueFire from 'vuefire'
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.use(VueFire)
Vue.use(KeenUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
