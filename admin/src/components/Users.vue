<template>
  <div>
    <ui-textbox
      icon="search"
      placeholder="Начните вводить имя"
      v-model="queryUsername">
    </ui-textbox>
    <div class='users'>
      <div class='user' v-for='user in filteredUsers' ref='user'>
        <!-- <div @click='removeUser(user.id)'>x</div> -->
        <div class='user__avatar'>
        <a target='_blank' :href="'http://vk.com/id' + user.id">
          <div class='avatar__status' :class="{ 
              'avatar--isNotActive' : user.isActive === false,
              'avatar--isActive': user.isActive === true
            }">
          </div>
          <img
            class='avatar'
            :src='user.photo_100'
          />
        </a>
        </div>
        <div class='user__stats'>
          <b>{{user.you_liked || 0}}</b> <b>{{user.liked_you || 0}}</b>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'users',
  data: function () {
    return {
      queryUsername: '',
      searchByUsername: ''
    }
  },
  computed: {
    ...mapState({
      users: state => state.users
    }),
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
  }
}
</script>
<style scoped>

.user {
  width: 100px;
  padding: .5rem;
  /*border: 1px solid #cfd8dc;*/
  margin-left: -1px;
  margin-bottom: -1px;
}

.user__stats {
  text-align: center;
  font-size: .75rem;
}

.users {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.user__avatar {
  display: flex;
  justify-content: center;
  position: relative;
}

.avatar {
  /*border: 1px solid white;*/
  height: 80px;
  width: 80px;
}

.avatar__status {
  height: 10px;
  width: 10px;
  background-color: black;
  position: absolute;
  margin: 5px;
  border-radius: 100%;
}

.avatar--isNotActive {
  background-color: #ef5350;
}

.avatar--isActive {
  background-color: #8bc34a;
}

</style>
