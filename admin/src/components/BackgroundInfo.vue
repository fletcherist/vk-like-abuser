<template>
  <div>
    <div v-html='usersCount'></div>
    <br>
    <div v-for='user of users'>
      <div>{{user}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'background',
  data () {
    return {
      users: [],
      usersCount: 0
    }
  },
  sockets: {
    connect () {
      console.log('socket connected')
      console.log(this.$socket)
      this.$socket.emit('count_online_users', data => {
        console.log(data)
        this.users = data
        this.usersCount = data.length
      })
    }
  },
  methods: {

  }
}
</script>
<style>
</style>
