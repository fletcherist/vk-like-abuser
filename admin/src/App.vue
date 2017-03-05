<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style>

body {
  background-color: #424242 !important;
}

#app {
  font-family: 'Helvetica Neue';
}

.ui-tabs__body {
  background-color: rgb(54, 57, 62) !important;
}
</style>
