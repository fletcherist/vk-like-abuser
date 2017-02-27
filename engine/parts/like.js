const VK = require('./vk')
const Console = require('./console')
const Users = require('./users')
const DB = require('./db')
const TasksToExtension = require('./tasksToExtension') 

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
            this.item = id

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
              console.log(e)
              new Console().error(`{Like} id${object} ☒☒☒ id${target}`)
              this.errorHandler(e)
              return reject(e)
            })
          }).catch(e => {
            console.log(e)
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
    const ERRORS = {
      FLOOD_CONTROL: 'FLOOD_CONTROL',
      VALIDATION_REQUIRED: 'VALIDATION_REQUIRED'
    }
    const alerts = {
      floodControl: {
        msg: 'Flood control',
        error: ERRORS.FLOOD_CONTROL
      },
      validationRequired: {
        msg: 'Validation required: please open redirect_uri in browser',
        error: ERRORS.VALIDATION_REQUIRED
      }
    }

    const errorMessage = e.toString()
    let error = null
    for (let alert in alerts) {
      if (errorMessage.match(alerts[alert].msg)) {
        error = alerts[alert].error
        break
      }
    }

    console.log(error)
    switch (error) {
      case ERRORS.FLOOD_CONTROL:
        this.db.setFloodControl(this.object)
        break
      case ERRORS.VALIDATION_REQUIRED:
        const task = new TasksToExtension().add({
          object: this.object,
          target: this.target,
          item: this.item
        })

        this.db.setInactive(this.object)
        break
      default:
        break
    }

    if (this.object && this.target) {
      this.db.setNotValid(this.object)
    }
  }
}


function VK_API_WAIT () {
  const generated = randomFromInterval(1000, 10000)
  return generated
}

function randomFromInterval(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

module.exports = Like