<template>  
  <div class='wrapper'>
    <!-- <ui-button @click='sortUsers()'>Sort Users</ui-button> -->
    <!-- <ui-button @click='sortUsers()'>Sort Users By Likes</ui-button> -->
    <div class='nav'>
      <div class='nav__link'><router-link to="users">users</router-link></div>
      <div class='nav__link'><router-link to="stats">statistics</router-link></div>
      <div class='nav__link'><router-link to="background">background</router-link></div>
    </div>

    <h1></h1>

    <router-view></router-view>
  </div>
</template>

<script>
import Stats from './Stats'
import Users from './Users'
import Tasks from './Tasks'

import { mapState } from 'vuex'

export default {
  name: 'hello',
  data () {
    return {
      sortedUsers: [],
      global_stats: {
        users: {
          total: 0,
          active: 0,
          inactive: 0
        }
      }
    }
  },
  methods: {
    getStats: function (id) {
      let you_liked = 0
      let liked_you = 0

      if (!id) {
        return {
          you_liked,
          liked_you
        }
      }

      if (this.stats && this.stats.length > 0 &&
        this.users && this.users.length > 0
      ) {
        let i = 0
        for (let stat of this.stats) {
          if (stat['.key'] === id) {
            you_liked = this.stats[i].you_liked
            liked_you = this.stats[i].liked_you

            this.users[id].you_liked = you_liked
            this.users[id].liked_you = liked_you

            break
          }
          i++
        }
      }

      return {
        you_liked,
        liked_you
      }
    },
    removeUser: function (id) {
      console.log(this.$firebaseRefs.users)
      // db.ref(`users/${id}`).remove()
    }
  },
  computed: {
    ...mapState({
      users: state => state.users
    }),
    isActive: function () {
      if (this.users && this.users.length) {
        let isActiveCount = 0
        this.users.forEach(user => {
          if (user.isActive === true) {
            isActiveCount++
          }
        })
        return isActiveCount
      }
      return 'loading...'
    },
    isNotActive: function () {
      if (this.users && this.users.length) {
        return this.users.length - this.isActive
      }
      return 'loading...'
    }
  },
  components: {
    'stats': Stats,
    'users': Users,
    'tasks': Tasks
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: blue;
}

.quick-stats {
  display: inline-block;
  margin: 1rem;
}

.nav {
  display: flex;
}

.nav__link {
  flex-grow: 1;
  margin: 1rem;
}
</style>
