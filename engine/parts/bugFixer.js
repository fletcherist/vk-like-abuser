const DB = require('./db')
const anArrayFromObject = require('../funcs/anArrayFromObject')
const Promise = require('bluebird')

const db = new DB().db

class BugFixer  {
  constructor () {
    this.DB = new DB()
    this.db = this.DB.db
  }

  fixUsersID () {
    this.db.ref('/users').once('value', snap => {
      const users = snap.val()
      for (let userId in users) {
        const user = users[userId]
        const { id, access_token } = user
        if (!id) {
          console.log(userId)
          db.ref(`/users/${userId}/id`)
            .transaction(currentValue => parseInt(userId))
        }
        // if (!access_token) {
        //   db.ref(`/users/${userId}`).remove()
        // }
      }
    })
  }

  validateUsers () {
    return new Promise((resolve, reject) => {
      let users = this.db.ref('users')
      users.once('value', data => {
        const users = anArrayFromObject(data.val())
        const promises = []

        let timeoutTime = 1000

        users.forEach(user => {
          // if (user.isValid !== false) {
            promises.push(() => new Promise((resolve, reject) => {
              this.DB.updateUserInfo(user)
                .then(r => resolve(r))
                .catch(e => resolve(e))
            }))
          // }
        })


        Promise.each(promises, promise => {
          return promise()
        }).then(r => {
            new Console().success('{DB} All users are fine')
            return resolve()
          })
          .catch(e => {
            new Console().success('{DB} NOT all the users are fine')
            return reject()
          })
      })
    })
  }
}

module.exports = BugFixer