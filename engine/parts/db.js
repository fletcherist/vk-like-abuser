const firebase = require('firebase')
const Promise = require('bluebird')
const app = require('./app')

const Console = require('./console')
const VK = require('./vk')
const anArrayFromObject = require('../funcs/anArrayFromObject')

let db = app.database()

const {
  getUsers,
  getUser,

  isUserExist,
  deactivateUser

} = require('../api/db/users')

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

      setTimeout(() => {
        let vk = new VK(access_token)
        vk.getUser(id).then(_user => {
          console.log(_user)
          if (_user) {
            const { first_name, last_name, photo_100, photo_50, sex, bdate } = _user
            const username = `${first_name} ${last_name}`
            db.ref(`users/${id}`).update({
              username: username,
              photo_100: photo_100,
              photo_50: photo_50,
              isValid: true,
              isActive: true,
              sex: sex === 1 ? 'f' : 'm',
              bdate: bdate || '0'
            })
            new Console().success(`{Listeners} ${username} is OK`)
            return resolve()
          } else {
            return reject()
          }

        }).catch(e => {
          console.log(e)
          db.ref(`users/${id}`).update({
            isValid: false,
            isActive: false
          })
          new Console().error(`{Listeners} ${id} couldnt do authentication`)
          return reject()
        })
      }, 1000)
    })
  }

  async getUsers () {
    const users = await getUsers(10)
    return users
  }

  async getUserById (id) {
    return await getUser(id)
  }

  async isUserExist (id) {
    return await isUserExist(id)
  }

  async deactivateUser (id) {
    return await deactivateUser(id)
  }

  addToLikedList ({object, target, type, id}) {
    if (!object) return new Console().error('{DB} No object user profided')
    if (!target) return new Console().error('{DB} No target user provided')
    if (!type) return new Console().error('{DB} No type provided')
    if (!id) return new Console().error('{DB} No id provided')

    object = parseInt(object)
    target = parseInt(target)
    type = parseInt(type)
    id = parseInt(id)

    this.db.ref(`/likes/${object}/${target}/${type}/${id}`).set(1)
  
    let youLiked = this.db.ref(`/statistics/${object}/you_liked`)
    youLiked.transaction(currentValue => (currentValue || 0) + 1)

    let likedYou = this.db.ref(`/statistics/${target}/liked_you`)
    likedYou.transaction(currentValue => (currentValue || 0) + 1)

    let latestLike = this.db.ref(`/users/${object}/latestLike`)
    latestLike.transaction(currentValue => firebase.database.ServerValue.TIMESTAMP)
  }

  setInactive (id) {
    if (!id) return false
    const isActive = this.db.ref(`/users/${id}/isActive`)
    isActive.transaction(currentValue => false)
  }

  setNotValid (id) {
    if (!id) return false
    const isValid = this.db.ref(`/users/${id}/isValid`)
    isValid.transaction(currentValue => false)
  }

  setFloodControl (id) {
    if (!id) return false
    const floodControl = this.db.ref(`/users/${id}/floodControl`)
    floodControl.transaction(currentValue => firebase.database.ServerValue.TIMESTAMP)
  }
}

module.exports = DB