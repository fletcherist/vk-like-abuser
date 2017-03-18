<template>  
  <div class='wrapper'>
    <!-- <ui-button @click='sortUsers()'>Sort Users</ui-button> -->
    <!-- <ui-button @click='sortUsers()'>Sort Users By Likes</ui-button> -->
    <ui-toolbar
      title='VK Like Abuser Reactor'
    >
      <div slot="actions">
        <!-- <div class='quick-stats'>228/54</div> -->
        <ui-icon-button
          color="black"
          icon="refresh"
          size="large"
          type="secondary"
          @click='loadData()'
        ></ui-icon-button>
      </div>
    </ui-toolbar>
    <ui-tabs
      raised>
      <ui-tab title="Сей час">
        <div v-if="global_stats">
          <!-- <stats :globalStats="global_stats"></stats> -->
        </div>
      </ui-tab>
      <ui-tab title="Пользователи">
        <ui-textbox
          icon="search"
          placeholder="Начните вводить имя"
          v-model="queryUsername">
        </ui-textbox>
        <div class='users'>
          <div class='user' v-for='user in filteredUsers' ref='user'>
            <!-- <div @click='removeUser(user.id)'>x</div> -->
            <div class='user__avatar'>
            <!-- target='_blank' :href="'http://vk.com/id' + user.id" -->
            <a>
              <img
                class='avatar'
                :src='user.photo_100'
                :class="{ 
                  'avatar--isNotActive' : user.isActive === false,
                  'avatar--isActive': user.isActive === true
                }"
              />
            </a>
            </div>
            <div class='user__stats'>
              <b>{{user.you_liked}}</b>
              <b>{{user.liked_you}}</b>
            </div>
          </div>
        </div>
      </div>
      </ui-tab>
    </ui-tabs>

</template>

<script>
import Stats from './Stats'

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
      searchByUsername: '',
      sortedUsers: [],
      queryUsername: '',
      global_stats: {
        users: {
          total: 0,
          active: 0,
          inactive: 0
        }
      }
    }
  },
  firebase: {
    // stats: {
    //   source: stats,
    //   asObject: true
    // },
    // stats: stats,
    // global_stats: {
      // source: db.ref('/global_stats'),
      // asObject: true
    // }
  },
  methods: {
    // loadData: function () {
    //   return new Promise(resolve => {
    //     db.ref('users').orderByChild('createdAt').once('value', snap => {
    //       this.users = anArrayFromObject(snap.val())
    //       db.ref('statistics').once('value', snap => {
    //         const stats = snap.val()
    //         this.users.map(user => {
    //           if (stats[user.id]) {
    //             user.you_liked = stats[user.id].you_liked
    //             user.liked_you = stats[user.id].liked_you
    //           }
    //         })
    //         this.stats = anArrayFromObject(snap.val())
    //         return resolve()
    //       })
    //     })
    //   })
    // },
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
    },
    filteredUsers: function () {
      return this.users.filter(user => {
        if (user && user.username) {
          return user.username
            .toLowerCase()
            .indexOf(this.queryUsername.toLowerCase()) > -1
        }

        return false
      })
    }
  },
  components: {
    'stats': Stats
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


.users {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.user {
  width: 100px;
  padding: .5rem;
  /*border: 1px solid #cfd8dc;*/
  margin-left: -1px;
  margin-bottom: -1px;
}

.user:hover {
  background-color: #dfe6ed;
}

.user__stats {
  text-align: center;
  font-size: .75rem;
  color: #546e7a !important;
}

.user__avatar {
  display: flex;
  justify-content: center;
}

.avatar {
  border-radius: 100%;
  border: 2px solid white;
  height: 50px;
  width: 50px;
}

.avatar--isNotActive {
  border-color: #ef5350;
}

.avatar--isActive {
  border-color: #81d4fa;
}

.quick-stats {
  display: inline-block;
  margin: 1rem;
}
</style>
