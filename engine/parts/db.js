const firebase = require('firebase')
const app = require('./app')

const Console = require('./console')
const VK = require('./vk')
const anArrayFromObject = require('../funcs/anArrayFromObject')

let db = app.database()

let dbInstance = null
class DB {
  constructor () {
    if (!dbInstance) {
      this.app = app
      this.db = db

      new Console().success('{DB} Connection established')
      dbInstance = this
    }

    return dbInstance
  }

  updateUserInfo (user) {
    return new Promise((resolve, reject) => {
      const { access_token, id } = user

      let vk = new VK(access_token)
      vk.getUser(id).then(_user => {
        if (_user) {
          const { first_name, last_name, photo_100, photo_50 } = _user
          const username = `${first_name} ${last_name}`
          db.ref(`users/${id}`).update({
            username: username,
            photo_100: photo_100,
            photo_50: photo_50,
            isValid: true
          })
          new Console().success(`{Listeners} ${username} is OK`)
          return resolve()
        } else {
          return reject()
        }
      }).catch(e => {
        db.ref(`users/${id}`).update({
          isValid: false,
          isActive: false
        })
        new Console().error(`{Listeners} ${id} couldnt do authentication`)
        return reject()
      })
    })
  }

  updateUsersInfo () {
    return new Promise((resolve, reject) => {
      let users = this.db.ref('users')
      users.once('value', data => {
        const users = anArrayFromObject(data.val())
        const promises = []

        users.forEach(user => {
          if (user.isValid !== false) {
            promises.push(new Promise((resolve, reject) => {
              this.updateUserInfo(user)
                .then(r => resolve(r))
                .catch(e => reject(e))
            }))
          }
        })

        return Promise.all(promises)
          .then(r => {
            new Console().success('{DB} All users are fine')
            return resolve()
          })
          .catch(e => {
            new Console().success('{DB} NOT all the users are fine')
            console.log(e)
            return reject()
          })
      })
    })
  }

  getUsers () {
    return new Promise ((resolve, reject) => {
      this.db.ref('/users').once('value')
      .then(snapshot => {
        let users = snapshot.val()
        for (let userId in users) {
          let user = users[userId]
          if (user.isActive === false) {
            delete users[userId]
          }
        }
        return resolve(users)
      })
      .catch(e => reject())
    })
  }


  getUserById (id) {
    return new Promise ((resolve, reject) => {
      let user = this.db.ref(`/users/${id}`)
      user.once('value').then(r => {
        if (r.val() == null) {
          return resolve(r.val())
        }

        return reject()
      })
    })
  }

  isUserExist (id) {
    return new Promise ((resolve, reject) => {
      let user = this.db.ref(`/users/${id}`)
      user.once('value').then(r => {
        if (r.val() == null) {
          return resolve()
        }

        return reject()
      })
    })
  }

  findAvailableItemToLike ({object, target, type, items}) {
    return new Promise((resolve, reject) => {
      const alreadyLiked = this.db.ref(`/likes/${object}/${target}/${type}`)

      alreadyLiked.once('value', likes => {
        if (likes.val()) {
          const alreadyLikedList = likes.val()
          for (let availableItemId of items) {
            if (alreadyLikedList[availableItemId] === 1) {
              // In that case do nothing
            } else {
              return resolve(availableItemId)
            }
          }
        }

        return resolve(items[0])
      })
    })
  }

  addUser ({username, access_token, id}) {
    if (!username) return new Console().error('{DB} No username provided')
    if (!access_token) return new Console().error('{DB} No access token provided')
    if (!id) return new Console().error('{DB} No vk id provided')

    this.isUserExist(id)
    .then(isUserExist => {
        this.db.ref(`users/${id}`).set({
          username,
          access_token,
          id,
          createdAt: firebase.database.ServerValue.TIMESTAMP
        }).then(r => new Console().success(`{DB} User ${username} has been added`))
      }
    ).catch(e => {
      return new Console().error('{DB} User is already exist')
    })
  }

  isInLikedList () {
    return true
  }

  addToLikedList ({object, target, type, id}) {
    if (!object) return new Console().error('{DB} No object user profided')
    if (!target) return new Console().error('{DB} No target user provided')
    if (!type) return new Console().error('{DB} No type provided')
    if (!id) return new Console().error('{DB} No id provided')

    this.db.ref(`/likes/${object}/${target}/${type}/${id}`).set(1)
    let youLiked = this.db.ref(`/statistics/${object}/you_liked`)
    youLiked.transaction(currentValue => (currentValue || 0) + 1)

    let likedYou = this.db.ref(`/statistics/${target}/liked_you`)
    likedYou.transaction(currentValue => (currentValue || 0) + 1)

    let latestLike = this.db.ref(`/users/${object}/latestLike`)
    latestLike.transaction(currentValue => firebase.database.ServerValue.TIMESTAMP)
  }

  setNotValid (id) {
    if (!id) return false
    const isValid = this.db.ref(`/users/${id}/isValid`)
    isValid.transaction(currentValue => false)
  }
}

module.exports = DB