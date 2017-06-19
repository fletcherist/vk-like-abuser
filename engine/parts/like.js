const VK = require('./vk')
const Console = require('./console')
const Users = require('./users')
const DB = require('./db')
const ErrorResolver = require('./errorResolver')

class Like {
  constructor ({object, target}) {
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

        this.vk.getPhoto(target).then(photo => {
          this.item = photo
          this.vk.like({
            target: this.target,
            id: this.item
          }).then(r => {
            this.db.addToLikedList({
              object: this.object,
              target: this.target,
              id: this.item,
              type: 'photo'
            })
            new Console().success(`{Like} id${object} > id${target}`)
            this.createRealtimeLike()

            return resolve()
          }).catch(e => {
            new Console().error(`{Like} id${object} ☒ id${target}`)
            this.errorHandler(e)
            return reject(e)
            })
        }).catch(e => {
          this.errorHandler(e)
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

    if (!objectUser.photo_100 || !targetUser.photo_100) {
      return false
    }

    const realtimeLikes = this.db.db.ref('/realtime_likes')
    realtimeLikes.push({
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

    realtimeLikes.once('value', snap => {
      const likes = snap.val()
      const likesAsObject = Object.keys(likes)
      // Remove all branch
      if (likesAsObject.length > 100) {
        return realtimeLikes.remove() 
      }
      if (likesAsObject.length > 10) {

        // Iterate over no-need keys and remove them
        for (let i = 0; i <  likesAsObject.length - 10; i++) {
          realtimeLikes.child(likesAsObject[i]).remove()
        }
        // realtimeLikes.child()
      }
    })
  }

  errorHandler (e) {
    if (e) {
      return new ErrorResolver({
        error: e,
        object: this.object,
        target: this.target,
        item: this.item
      })
    }
  }
}


function VK_API_WAIT () {
  const generated = randomFromInterval(1000, 1001)
  return generated
}

function randomFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

module.exports = Like