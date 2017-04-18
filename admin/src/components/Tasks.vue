<template>
  <div class='box'>
    <div class='box__title'>Create new task</div>
    <ui-textbox
      label="User id"
      v-model="task.user_id">
    </ui-textbox>
    <ui-textbox
      label="Target id"
      v-model="task.target_id">
    </ui-textbox>
    <ui-textbox
      label="Item id"
      v-model="task.item_id">
    </ui-textbox>
    <ui-button @click='setTask(task)'>
      Set task
    </ui-button>
  </div>
</template>
<script>
import { db } from '../firebase'
console.log(db)

export default {
  name: 'tasks',
  data: function () {
    return {
      task: {
        user_id: '96170043',
        target_id: '96170043',
        item_id: '456239077'
      }
    }
  },
  methods: {
    setTask: function (task) {
      const { user_id, target_id, item_id } = task
      if (!user_id || !target_id || !item_id) {
        return false
      }
      db.ref(`/tasks/${user_id}`).push({
        object: user_id,
        target: target_id,
        item: item_id,
        createdAt: Date.now().toString(),
        status: 0
      })
      console.log(user_id, target_id, item_id)
    }
  }
}
</script>
<style scoped>
  .box {
    max-width: 150px;
  }
  .box__title {
    margin-bottom: 1rem;
  }
</style>
