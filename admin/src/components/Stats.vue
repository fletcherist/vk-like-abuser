<template>
  <div class='stats'>
    <!-- <div class='stats__active'>{{globalStats.users.active}} active</div>
    <div class='stats__not-active'>{{globalStats.users.inactive}} not active</div> -->
    <recounters></recounters>
    <div v-if="globalStats.users">
      <div class='stats__container'>
        <div class='stats__block'>
          <ui-icon icon='favorite' class='stats__icon'></ui-icon>
          <div class='stats__value'>
            {{globalStats.likes.all}}
            <div class='stats__value_desc'>likes</div>
          </div>
        </div>
      </div>
      <h1>users</h1>
      <div class='stats__container'>
        <div class='stats__block'>
          <!-- <ui-icon
            icon='mood'
            class='stats__icon'
          ></ui-icon> -->
          <div class='stats__value'>
            {{globalStats.users.active}}
            <span class='stats__value_desc'>active</span>
          </div>
        </div>
        <div class='stats__operators'>+</div>
        <div class='stats__block'>
          <!-- <ui-icon
            icon='mood_bad'
            class='stats__icon'>
          </ui-icon> -->
          <div class='stats__value'>
            {{globalStats.users.inactive}}
            <span class='stats__value_desc'>passive</span>
          </div>
        </div>
        <div class='stats__operators'>=</div>
        <div class='stats__block'>
          <!-- <ui-icon icon='perm_identity' class='stats__icon'></ui-icon> -->
          <div class='stats__value'>
            {{globalStats.users.total}}
            <span class='stats__value_desc'>current</span>
          </div>
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
import Recounters from './Recounters'

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
  },
  components: {
    'recounters': Recounters
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

.stats__value_desc {
  font-size: 1.25rem;
  font-weight: normal;
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
