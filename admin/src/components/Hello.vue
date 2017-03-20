<template>  
  <div class='wrapper'>
    <!-- <ui-button @click='sortUsers()'>Sort Users</ui-button> -->
    <!-- <ui-button @click='sortUsers()'>Sort Users By Likes</ui-button> -->
    <ui-tabs
      raised>
      <ui-tab title="Now">
        <div v-if="global_stats">
          <stats></stats>
        </div>
      </ui-tab>
      <ui-tab title="Users">
        <users></users>
      </div>
      </ui-tab>
    </ui-tabs>

</template>

<script>
import Stats from './Stats'
import Users from './Users'

import { mapState } from 'vuex'

// let me = db.ref(`users/${MY_ID}`)
// let stats = db.ref(`statistics`)

// function anArrayFromObject (obj) {
//   const arr = []
//   for (let val in obj) {
//     arr.push(obj[val])
//   }
//   return arr
// }

export default {
  name: 'hello',
  mounted: function () {
    // this.loadData()
  },
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
    'users': Users
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
a {
  text-decoration: none;
  color: black;
}

/*.wrapper {
  max-width: 80vw;
  margin: 4rem auto;
}*/

/*@media (max-width: 500px) {
  .wrapper {
    max-width: 100vw;
    margin: 0rem auto;
  }
}*/

.quick-stats {
  display: inline-block;
  margin: 1rem;
}
</style>
