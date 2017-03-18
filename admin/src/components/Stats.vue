<template>
  <div class='stats'>
    <!-- <div class='stats__active'>{{globalStats.users.active}} active</div>
    <div class='stats__not-active'>{{globalStats.users.inactive}} not active</div> -->
    <recounters></recounters>
    <div v-if="globalStats.users" class='container'>
      <div class='stats__container'>
        <div class='stats__block'>
          <div class='stats__value_desc'>
            <ui-icon icon='perm_identity' class='stats__icon'></ui-icon>
            All users 
          </div>
          <div class='stats__value'>
            {{globalStats.users.total}}
          </div>
        </div>
        <div class='stats__block'>
          <div class='stats__value_desc'>Active users </div>
          <div class='stats__value'>{{globalStats.users.active}}</div>
        </div>
        <div class='stats__block'>
          <div class='stats__value_desc'>Inactive users </div>
          <div class='stats__value'>
            {{globalStats.users.inactive}}
          </div>
        </div>
      </div>
      <div class='stats__container'>
        <div class='stats__block'>
          <div class='stats__value_desc'>
            <ui-icon icon='favorite' class='stats__icon'></ui-icon>
            Likes count
          </div>
          <div class='stats__value'>
            {{globalStats.likes.all}}
          </div>
        </div>
        <div class='stats__block'>
          <div class='stats__value_desc'>
            Like errors
          </div>
          <div class='stats__value'>
            {{globalStats.errors.all}}
          </div>
        </div>
      </div>
      <div class='stats__container'>
        <div class='stats__block'>
          <div class='stats__value_desc'>
            <ui-icon icon='free_breakfast' class='stats__icon'></ui-icon>
            today
          </div>
        </div>
        <div class='stats__block'>
          <div class='stats__value_desc'>
            new sign ups
          </div>
          <div class='stats__value'>
            {{todayStats.users || 0}}
          </div>
        </div>
        <div class='stats__block'>
          <div class='stats__value_desc'>
            new likes
          </div>
          <div class='stats__value'>
            {{todayStats.likes}}
          </div>
        </div>
        <div class='stats__block'>
          <div class='stats__value_desc'>
            errors
          </div>
          <div class='stats__value'>
            {{todayStats.errors}}
          </div>
        </div>
      </div>
      <div class='stats__container'>
        <div class='stats__block'>
          <div class='stats__value_desc'>
            <ui-icon icon='show_chart' class='stats__icon'></ui-icon>
            percents
          </div>
        </div>
        <div class='stats__block'>
          <div class='stats__value_desc'>
            success likes
          </div>
          <div class='stats__value'>
            {{successLikes}}%
          </div>
        </div>
        <div class='stats__block'>
          <div class='stats__value_desc'>
            error likes
          </div>
          <div class='stats__value'>
            {{errorLikes}}%
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
import { mapGetters } from 'vuex'

import { db } from '../firebase'
import TimeAssistant from '../utils/timeAssistant'

const time = new TimeAssistant()
const todayStatsLink = `/daily_statistics/${time.getDateForFirebase()}`
export default {
  name: 'stats',
  computed: {
    ...mapGetters(['globalStats', 'todayStats']),
    successLikes () {
      return (this.globalStats.likes.all / (this.globalStats.errors.all + this.globalStats.likes.all)).toFixed(2) * 100
    },
    errorLikes () {
      return (this.globalStats.errors.all / (this.globalStats.errors.all + this.globalStats.likes.all)).toFixed(2) * 100
    }
  },
  firebase: {
    globalStats: {
      source: db.ref('/global_stats'),
      asObject: true
    },
    todayStats: {
      source: db.ref(todayStatsLink),
      asObject: true
    }
  },
  components: {
    'recounters': Recounters
  }
}

</script>
<style scoped>

.container {
  display: flex;
}

@media (max-width: 500px) {
  .container {
    flex-direction: row;
  }
}
  
.stats {
}

.stats__container {
  display: flex;
  flex-direction: column;
  max-width: 50%;
}



.stats__block {
  color: black;
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  width: 300px;
}

.stats__icon {
  font-size: 2rem !important;
  color: #eee;
}

.stats__value {
  align-self: center;
}

.stats__value_desc {
  font-size: 1rem;
  font-weight: lighter;
  text-transform: uppercase;
  /*align-self: flex-start;*/
  width: 60%;
}

.stats__active {
  color: #2e7d32;
}
.stats__not-active {
  color: #d32f2f;
}

</style>
