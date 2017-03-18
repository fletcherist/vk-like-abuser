<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

import store from './store'
console.log(store)

store.commit('increment')

console.log(store.state.count)

export default {
  name: 'app'
}
</script>

<style>

#app {
  font-family: "Roboto Mono",serif;
}

body {
  padding: 0px;
  margin: 0px;
}

</style>
