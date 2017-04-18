import Vue from 'vue'
import App from './App'

import KeenUI from 'keen-ui'
import router from './router'

import '../node_modules/keen-ui/dist/keen-ui.css'
import { db } from './firebase'

import VueFire from 'vuefire'
import VuexFire from 'vuexfire'
import Vuex from 'vuex'

import anArrayFromObject from './utils/anArrayFromObject'

Vue.use(Vuex)
Vue.use(VueFire)
Vue.use(VuexFire)
Vue.use(KeenUI)

export const store = new Vuex.Store({
  state: {
    count: 0,
    users: [],
    globalStats: {},
    todayStats: {}
  },
  mutations: {
    ...VuexFire.mutations,
    increment (state) {
      state.count++
    },
    loadUsers (state, users) {
      state.users = users
    }
  },
  getters: {
    globalStats (state) {
      return state.globalStats
    },
    todayStats: state => state.todayStats
  },
  actions: {
    loadUsers ({commit}) {
      db.ref('users').orderByChild('createdAt').once('value', snap => {
        const users = anArrayFromObject(snap.val())
        db.ref('statistics').once('value', snap => {
          const stats = snap.val()
          users.map(user => {
            if (stats[user.id]) {
              user.you_liked = stats[user.id].you_liked
              user.liked_you = stats[user.id].liked_you
            }
          })
          commit('loadUsers', users)
        })
      })
    }
  }
})

store.dispatch('loadUsers')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
