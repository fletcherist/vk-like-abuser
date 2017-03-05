<template>
  <div class='stats'>
    <!-- <div class='stats__active'>{{globalStats.users.active}} active</div>
    <div class='stats__not-active'>{{globalStats.users.inactive}} not active</div> -->
    <div v-if="globalStats.users">
      <div class='stats__container'>
        <div class='stats__block'>
          <ui-icon icon='favorite' class='stats__icon'></ui-icon>
          <div class='stats__value'>{{globalStats.likes.all}}</div>
        </div>
      </div>
      <h1>users</h1>
      <div class='stats__container'>
        <div class='stats__block'>
          <ui-icon
            icon='accessibility'
            class='stats__icon'
          ></ui-icon>
          <div class='stats__value'>{{globalStats.users.active}}</div>
        </div>
        <div class='stats__operators'>+</div>
        <div class='stats__block'>
          <ui-icon
            icon='accessible'
            class='stats__icon'>
          </ui-icon>
          <div class='stats__value'>{{globalStats.users.inactive}}</div>
        </div>
        <div class='stats__operators'>=</div>
        <div class='stats__block'>
          <ui-icon icon='perm_identity' class='stats__icon'></ui-icon>
          <div class='stats__value'>{{globalStats.users.total}}</div>
        </div>
      </div>
    </div>
    <div v-else>
      <ui-progress-circular
        color="multi-color"
        :size="54"
      ></ui-progress-circular>
    </div>
  </div>
</template>
<script>

export default {
  name: 'stats',
  props: {
    'globalStats': {
      type: Object,
      default: function () {
        return {
          users: {
            total: 0,
            active: 0,
            inactive: 0
          },
          likes: {
            all: 0
          }
        }
      }
    },
    'message': String
  }
}
</script>
<style>
  
.stats {
}

.stats__container {
  display: flex;
  align-items: center;
  background-color: rgb(54, 57, 62);
}

.stats__block {
  color: #546e7a;
  text-align: center;
  width: 30%;
}

.stats__icon {
  font-size: 3rem !important;
  color: #eee;
}

.stats__value {
  font-size: 2rem;
  font-weight: lighter;
}

.stats__operators {
  font-size: 3rem;
  font-weight: bold;
  color: #424242;
}

.stats__active {
  color: #2e7d32;
}
.stats__not-active {
  color: #d32f2f;
}

</style>
