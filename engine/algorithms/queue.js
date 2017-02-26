const Algorithms = require('./algorithms')
const shuffleArray = require('../funcs/shuffleArray')

class Queue extends Algorithms {
  constructor () {
    super()

    // Latest
    // this.users.sort((a, b) => {
    //   return a.latestLike > b.latestLike
    // })

    // Randomize
    this.users = shuffleArray(this.users)

    for (let i = 0; i <= this.users.length - 1; i++) {
      if (i === this.users.length - 1) {
        this.tasks.push({
          object: this.users[i].id,
          target: this.users[0].id
        })
        break
      }

      this.tasks.push({
        object: this.users[i].id,
        target: this.users[i + 1].id
      })
    }

    return this.tasks
  }
}

class Autofixers {
  constructor () {
    this.db = db

    this.fixUsersStats()
  }

  fixUsersStats () {
    const stats = this.db.ref('statistics')
    stats.once('value', snap => {
      // console.log(snap.val())
      let statistics = snap.val()
      for (let stat in statistics) {
        if (!stat.you_liked || !stat.liked_you) {
          // console.log(stat)
        } 
      }
    })
  }
}

module.exports = Queue