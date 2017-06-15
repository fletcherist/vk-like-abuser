import Vue from 'vue'
import Router from 'vue-router'
import Main from 'components/Main'
import Users from 'components/Users'
import Stats from 'components/Stats'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
      children: [
        {
          path: 'users',
          name: 'Users',
          component: Users
        },
        {
          path: 'stats',
          name: 'stats',
          component: Stats
        }
      ]
    }
  ]
})
