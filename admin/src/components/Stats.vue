<template>
  <div class='stats'>
    <!-- <div class='stats__active'>{{globalStats.users.active}} active</div>
    <div class='stats__not-active'>{{globalStats.users.inactive}} not active</div> -->
    <!-- <recounters></recounters> -->
    <div v-if="globalStats.users" class='container'>
      <div class='stats__container'>
        <div class='stats__block'>
          <div class='stats__value_desc'>
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
        <div class='stats__block'>
          <div class='stats__value_desc'>
            tasks set
          </div>
          <div class='stats__value'>
            {{todayTasks.all}}
          </div>
        </div>
        <div class='stats__block'>
          <div class='stats__value_desc'>
            tasks completed
          </div>
          <div class='stats__value'>
            {{todayTasks.success}}
          </div>
        </div>
      </div>
      <div class='stats__container'>
        <div class='stats__block'>
          <div class='stats__value_desc'>
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
        <div class='stats__block'>
          <div class='stats__value_desc'>
            active users
          </div>
          <div class='stats__value'>
            {{activeUsers}}%
          </div>
        </div>
      </div>
      <div class='stats__container'>
        <div class='stats__block'>
          <div class='stats__value_desc'>
            Tasks
          </div>
          <div class='stats__value'>
            {{globalStats.tasks.all}}
          </div>
        </div>
        <div class='stats__block'>
          <div class='stats__value_desc'>
            completed tasks
          </div>
          <div class='stats__value'>
            {{globalStats.tasks.success}}
          </div>
        </div>
        <div class='stats__block'>
          <div class='stats__value_desc'>
            waiting tasks
          </div>
          <div class='stats__value'>
            {{globalStats.tasks.all - globalStats.tasks.success}}
          </div>
        </div>
      </div>
    </div>
    <div v-else>
    loading
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
    },
    activeUsers () {
      return (this.globalStats.users.active / this.globalStats.users.total)
        .toFixed(2) * 100
    },
    todayAllTasks () {
      if (this.todayStats && this.todayStats.tasks) {
        return this.todayStats.tasks.all
      }
      return 0
    },
    todayTasks () {
      if (this.todayStats && this.todayStats.tasks) {
        return this.todayStats.tasks
      }

      return {
        all: 0,
        success: 0
      }
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
}

.stats {
}

.stats__container {
  display: flex;
  flex-direction: column;
  flex-grow: 2px;
  padding: 15px;
  /*box-shadow: 2px 1px 10px rgba(0, 0, 0, .1);*/
  border-bottom: 1px solid #eee;
  margin: 5px;
}



.stats__block {
  color: black;
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  width: 300px;
  text-align: left;
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
  text-transform: lowercase;
  /*align-self: flex-start;*/
  width: 70%;
}

.stats__active {
  color: #2e7d32;
}
.stats__not-active {
  color: #d32f2f;
}

</style>
