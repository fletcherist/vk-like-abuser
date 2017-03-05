<template>  
  <div>

    <div class='stats'>
      <h1>{{users.length}} users</h1>
      <div class='stats__active'>{{isActive}} active</div>
      <div class='stats__not-active'>{{isNotActive}} not active</div>
    </div>

    <ui-textbox icon="search" placeholder="Search" v-model="queryUsername"></ui-textbox>

    <ui-button @click='sortUsers()'>Sort Users</ui-button>
    <ui-button @click='sortUsers()'>Sort Users By Likes</ui-button>

    <div class='users'>
      <div class='user' v-for='user in filteredUsers' ref='user'>
        <!-- <div @click='removeUser(user.id)'>x</div> -->
        <div class='user__avatar'>
        <!-- target='_blank' :href="'http://vk.com/id' + user.id" -->
        <a>
          <img
            class='avatar'
            v-bind:src='user.photo_100'
            v-bind:class="{ 
              'avatar--isNotActive' : user.isActive === false,
              'avatar--isActive': user.isActive === true
            }"
          />
        </a>
        </div>
        <div class='user__stats'>
          <b>{{getStats(user.id).you_liked || 0}}</b>
          /
          <b>{{getStats(user.id).liked_you || 0}}</b>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyB1IjoxSLvx-C_hpyQ2irgzB01Tf3bts3I',
  authDomain: 'vk-free-likes.firebaseapp.com',
  databaseURL: 'https://vk-free-likes.firebaseio.com',
  storageBucket: 'vk-free-likes.appspot.com',
  messagingSenderId: '19336089245'
}
firebase.initializeApp(config)

let db = firebase.database()

let users = db.ref('users').orderByChild('createdAt')
// let me = db.ref(`users/${MY_ID}`)
let stats = db.ref(`statistics`)
let pushes = db.ref('pushes')
let likes = db.ref('likes')

export default {
  name: 'hello',
  mounted: function () {
    console.log('hello!')
  },
  data () {
    return {
      searchByUsername: '',
      users: this.users,
      sortedUsers: [],
      queryUsername: ''
    }
  },
  firebase: {
    users: users,
    // stats: {
    //   source: stats,
    //   asObject: true
    // },
    stats: stats,
    pushes: pushes,
    likes: likes
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

            // this.users[id].you_liked = you_liked
            // this.users[id].liked_you = liked_you

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
    },
    sortUsers: function () {
      this.$unbind(users)
      // this.users.sort((a, b) => {
      //   return a.createdAt > b.createdAt
      // })

      // return users
    },
    sortUsersByLikes: function () {
      // console.log(this.users)
      // this.users.sort((a, b) => {

      // })
    }
  },
  computed: {
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
          return user.username.indexOf(this.queryUsername) > -1
        }

        return false
      })
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
a {
  text-decoration: none;
  color: black;
}

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

.stats {
  margin: 1rem;
}

.stats__active {
  color: #2e7d32;
}
.stats__not-active {
  color: #d32f2f;
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
</style>
