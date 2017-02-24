<template>  
  <div>
    <h1>{{users.length}} человека</h1>
    <div v-for='user in users'>
      <div class='user'>
        <a target='_blank' :href="'http://vk.com/id' + user.id">
          <img class='avatar' v-bind:src='user.photo_100'/>
        </a>
        <div>
          <a target='_blank' :href="'http://vk.com/id' + user.id">
            {{user.username}} {{getStats(user.id)}}
          </a>
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

let users = db.ref('users')
// let me = db.ref(`users/${MY_ID}`)
let stats = db.ref(`statistics`)
let pushes = db.ref('pushes')
let likes = db.ref('likes')

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
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
      if (!id) return 'undef. / undef.'
      if (this.stats && this.stats.length > 0) {
        let i = 0
        for (let stat of this.stats) {
          if (stat['.key'] === id) {
            console.log(stat['.key'], id, this.stats[i])
            let { you_liked, liked_you } = this.stats[i]
            return `${you_liked}/${liked_you}`
          }
          i++
        }
      }
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
.user {
  display: flex;
  align-items: center;
}

.user:hover {
  background-color: #dfe6ed;
}

.avatar {
  border-radius: 50px;
  height: 50px;
  width: 50px;
  margin: 0 1rem 0 1rem;
}
</style>
