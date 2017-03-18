<template>
  <div class='stats__actions'>
    <ui-button @click='loadData()'>Load data</ui-button>
    <ui-button
      @click='recountLikes()'
      :loading="recountingLikes.loading"
      type='primary'
      >recount likes</ui-button>
    <ui-button
      @click='recountUsers()'
      :loading="recountingUsers.loading">
      recount users</ui-button>
  </div>
</template>
<script>

export default {
  name: 'recounters',
  data: function () {
    return {
      recountingLikes: {
        loading: false
      },
      recountingUsers: {
        loading: false
      }
    }
  },
  methods: {
    recountLikes: function () {
      this.recountingLikes.loading = true
      setTimeout(() => {
        this.recountingLikes.loading = false
      }, 3000)
    },
    recountUsers: function () {
      this.recountingUsers.loading = true
      setTimeout(() => {
        this.recountingUsers.loading = false
      }, 1000)
    }
  }
}
</script>
<style scoped>
  .stats__actions {
    margin-bottom: 2rem;
  }
</style>
