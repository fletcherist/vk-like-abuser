const VK = require('./vk')
const Console = require('./console')
const Users = require('./users')
const DB = require('./db')
const ErrorResolver = require('./errorResolver')

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
      console.log(user)
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
              this.createRealtimeLike()

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
            return reject(e)
          })
        }).catch(e => {
          new Console().error(`{Like} can't get user ${target} vk photos`)
          return reject(e)
        })
      }, VK_API_WAIT())
    })
  }


  // This creates a post in database with
  // quick picture, target and object ids.
  // And item, that was liked
  createRealtimeLike () {

    let objectUser = new Users().findById(this.object)
    let targetUser = new Users().findById(this.target)

    this.db.db.ref('/realtime_likes').push({
      object: {
        photo_100: objectUser.photo_100,
        id: this.object
      },
      target: {
        photo_100: targetUser.photo_100,
        id: this.target
      },
      item: this.item
    })
  }

  errorHandler (e) {
    return new ErrorResolver({
      error: e,
      object: this.object,
      target: this.target,
      item: this.item
    })
  }
}


function VK_API_WAIT () {
  const generated = randomFromInterval(1000, 10000)
  return generated
}

function randomFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

module.exports = Like