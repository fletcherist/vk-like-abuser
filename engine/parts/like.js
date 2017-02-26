const VK = require('./vk')
const Console = require('./console')
const Users = require('./users')
const DB = require('./db')

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


function VK_API_WAIT () {
  const generated = randomFromInterval(1000, 10000)
  return generated
}

function randomFromInterval(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

module.exports = Like