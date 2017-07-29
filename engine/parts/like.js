const VK = require('./vk')
const Console = require('./console')
const Users = require('./users')
const DB = require('./db')
const ErrorResolver = require('./errorResolver')

const delay = require('../funcs/delay')

async function Like ({object, target}) {
  if (!object || !target) {
    new Console().error('No object or target id')
    return Promise.reject()
  }

  let user = new Users().findById(object)
  if (!user) {
    new Console().error('{Like} No user with this id')
    return Promise.reject()
  }

  await delay(VK_API_WAIT())

  const { access_token } = user
  if (!access_token) {
    new Console().error('{Like} NO ACCESS_TOKEN')
    return Promise.reject()
  }

  const vk = new VK(access_token)
  const db = new DB()

  let item
  try {
    item = await vk.getPhoto(target)
  } catch (e) {
    errorHandler({object, target, item, e})
    new Console().error(`{Like} can't get user ${target} vk photos`)
    return Promise.reject()
  }
  
  try {
    await vk.like({target: target, id: item})
    await db.addToLikedList({
      object: object,
      target: target,
      id: item,
      type: 'photo'
    })
    new Console().success(`{Like} id${object} > id${target}`)
    return createRealtimeLike(object, target, item)

  } catch (e) {
    new Console().error(`{Like} id${object} ☒ id${target}`)
    errorHandler({object, target, item, e})
    return Promise.reject()
  }
}

// This creates a post in database with
// quick picture, target and object ids.
// And item, that was liked
async function createRealtimeLike (object, target, item) {
  let objectUser = new Users().findById(object)
  let targetUser = new Users().findById(target)

  if (!objectUser.photo_100 || !targetUser.photo_100) {
    return false
  }

  const db = new DB()

  const realtimeLikes = db.db.ref('/realtime_likes')
  realtimeLikes.push({
    object: {
      photo_100: objectUser.photo_100,
      id: object
    },
    target: {
      photo_100: targetUser.photo_100,
      id: target
    },
    item: item
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

function errorHandler ({object, target, item, e}) {
  if (e) {
    console.log('Error handler: ', object, target, item)
    return new ErrorResolver({
      error: e,
      object: object,
      target: target,
      item: item
    })
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