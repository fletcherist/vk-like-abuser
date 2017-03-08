const firebase = require('firebase')
const Console = require('./console')

/*
  object: id,
  target: id,
  item: id,
  status: 0 || 1

  (0 - not done yet)
  (1 - done successfully)
*/
class TasksToExtension {
  constructor () {
    // Do not move to the top of the file
    // While refactoring — doesn't working
    const DB = require('./db')
    this.db = new DB()
  }

  add ({object, target, item}) {
    this.object = object
    this.target = target
    this.item = item

    console.warn(this.object, this.target, this.item)

    if (this.object && this.target && this.item) {
      this.db.db.ref(`/tasks/${this.object}`).push({
        object: this.object,
        target: this.target,
        item: this.item,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        status: 0,
      })

      return new Console().notify('{TasksToExtension} task was pushed')
    }
    return new Console().error('{TasksToExtension} Error has occured while creating task')
  }
  check () {

  }
}

module.exports = TasksToExtension