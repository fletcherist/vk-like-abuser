const VKApi = require('node-vkapi')
const firebase = require('firebase')
const firebaseConfig = require('./firebaseConfig')

const RESTART_ENGINE_TIME = 60000

let app = require('./parts/app')
let db = app.database()

const DB = require('./parts/db')
const VK = require('./parts/vk')

const Console = require('./parts/console')
const Listeners = require('./parts/listeners')

const Users = require('./parts/users')
const GlobalStats = require('./parts/globalStats')

const globalStats = new GlobalStats()

globalStats.countAllCounters()
  .then(r => {
    console.log('counted')
  })

const algorithms = require('./algorithms')




class User extends Users {
  constructor ({username, id}) {
    super()
    if (!id) return new Console().error('{Users} VK [id] is not provided.')
    if (!username) return new Console().error('{Users} VK [username] is not provided')
    const user = {
      id,
      username
    }

    this.users[user.id] = user
    this.usersCount++
    new Console().success(`{Users} ${user.username} joined our club!`)

    return this.user
  }
}


class Likes {
  constructor () {
    this.likes = {

    }
  }

  add ({target, object}) {
    if (!target) return new Console().error('{Likes} target id is not provided')
    if (!object) return new Console().error('{Likes} object id is not provided')

    const like = {
      target,
      object
    }

    this.likes[target] = like
    return new Console().success('{Likes} like has been added')
  }

  showLikes () {
    console.log(this.likes)
  }
}

class Like extends Likes {
  constructor ({object, target}) {
    super()
    return new Promise ((resolve, reject) => {
      if (!object || !target) {
        new Console().error('No object or target id')
        return reject()
      }

      let user = new Users().findById(object)
      if (!user) {
        new Console().error('{Like} No user with this id')
        return reject()
      }

      
      // const types = ['post', 'photo']

      setTimeout(() => {
        const token = user.access_token
        if (!token) {
          new Console().error('{Like} NO ACCESS_TOKEN')
          return reject()
        }
        this.vk = new VK(token)

        this.db = new DB()
        this.object = object
        this.target = target

        this.vk.getPhotos(target).then(r => {
          const { count, items } = r
          if (count === 0) return reject()

          this.db.findAvailableItemToLike({
            type: 'photo',
            object,
            target,
            items: items
          }).then(id => {
            this.vk.like({
              target: target,
              id: id
            }).then(r => {
              this.db.addToLikedList({
                object: object,
                target: target,
                type: 'photo',
                id: id
              })
              new Console().success(`{Like} id${object} >>> id${target}`)
              return resolve()
            }).catch(e => {
              new Console().error(`{Like} id${object} ☒☒☒ id${target}`)
              this.errorHandler(e)
              return reject(e)
            })
          }).catch(e => {
            new Console().error(`{Like} id${object} ☒☒☒ id${target}`)
            this.errorHandler(e)
            return resolve()
          })
        }).catch(e => {
          new Console().error(`{Like} can't get user ${target} vk photos`)
          return resolve()
        })
        return resolve()
      }, VK_API_WAIT())
    })
  }

  errorHandler (e) {
    if (this.object && this.target) {
      this.db.setNotValid(this.object)
    }
  }
}


class Engine {
  constructor () {
    this.db = new DB()
    this.users = new Users()
    this.tasks = []

    if (!this.isItTimeToRunEngine()) {
      return false
    }

    this.users.initialize()
      .then(() => {
        new Console().success('{Engine} is initialized')
        this.getTasks()
        this.start()
      })
  }

  start () {
    this.getNextTask()
  }

  getTasks () {
    this.tasks = new algorithms.Queue()
  }

  getNextTask () {
    if (this.tasks.length === 0) {
      new Console().success('{Engine} All tasks are done')

    new Console().notify('{Engine} New engine cycle will be started in 30s')
      setTimeout(() => {
        new Console().notify('{Engine} New engine has been just started')
        new Engine()
      }, RESTART_ENGINE_TIME)
      return
    }
    this.doTask(this.tasks[0]).then(() => {
      this.tasks.shift()
      this.getNextTask()
    })
  }

  doTask ({object, target}) {
    return new Promise((resolve, reject) => {
      new Like({object, target})
        .then(() => {
          resolve()
        })
        .catch(() => {
          resolve()
        })
    })
  }

  isItTimeToRunEngine () {
    const currentTime = new Date().getHours()
    if (currentTime > 2 && currentTime < 8) {
      new Console().notify('{Engine} Its not a time to run Engine')
      return false
    }
    return true
  }
}

const listeners = new Listeners()
const engine = new Engine()

// const autofixers = new Autofixers()

function VK_API_WAIT () {
  const generated = randomFromInterval(1000, 10000)
  return generated
}

function randomFromInterval(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
