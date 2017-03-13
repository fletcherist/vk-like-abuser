const notifier = require('node-notifier')
const firebase = require('firebase')
const VK = require('./vk')
const Like = require('./like')

const Console = require('./console')

class Auth {
  constructor ({user, access_token}) {
    const DB = require('./db')

    this.DB = new DB()
    this.db = this.DB.db

    this.user = user
    this.access_token = access_token
  }

  authenticate () {
    const vkUser = new VK(this.access_token)
    vkUser.checkToken()
      // Success authentication
      // — Register new user
      .then(r => {
        vkUser.getUser().then(user => {
          // TODO:
          // this.db.addUser({
          //   access_token: access_token
          // })
          // Get some info about this user

          // Test like
          vkUser.like({target: 1, id: 376599151}).then(r => {
            // Auth success
            return this.signupSuccess({
              user: user,
              access_token: this.access_token
            })
          }).catch(e => {
            console.log(e)
            this.signupFailure({
              error: e.toString()
            })
          })
        }).catch(e => {
          console.log(e)
          this.signupFailure({
            error: e.toString()
          })
        })
      })
    .catch(e => {
      console.log(e)
      this.signupFailure({
        error: e.toString()
      })
    })
  }

  signupSuccess ({user, access_token}) {
    console.log(user)
    const { first_name, last_name, photo_100 } = user

    try {
      this.db.ref(`/users/${user.id}`).update({
        access_token: this.access_token,
        success_auth: 1,
        need_validation: 0,
        photo_100: photo_100,
        username: first_name + ' ' + last_name,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      })
    } catch (e) {
      console.log(e)
    }

    notifier.notify({
      title: 'New token has been passed',
      message: 'success'
    })
    console.log('atuh succeess')
  }

  signupFailure ({error, access_token}) {
    this.db.ref(`/users/${user.id}`).update({
      access_token: this.access_token,
      success_auth: 0,
      need_validation: 1,
      username: 'Unauthorized',
      createdAt: firebase.database.ServerValue.TIMESTAMP
    })
    console.log(error)
    notifier.notify({
      title: 'New token has been passed',
      message: 'error'
    })
  }
}

module.exports = Auth