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
export default {
  name: 'tasks',
  data: function () {
    return {
      task: {
        user_id: '123',
        target_id: '123',
        item_id: 'sadasd'
      }
    }
  },
  methods: {
    setTask: function (task) {
      console.log(this.data)
      console.log(task)
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
