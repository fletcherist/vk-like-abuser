const { db } = require('../parts/app')
const fetch = require('node-fetch')

const { isWallpostExist } = require('../api/vk/wall')
const { isPhotoExist } = require('../api/vk/photos')
const delay = require('../funcs/delay')

function parseVKLink (link) {
  const photoRegex = /=photo([0-9]{1,18})_([0-9]{1,40})%/
  const postRegex = /=wall([0-9]{1,18})_([0-9]{1,40})/
  const groupPostRegex = /=wall(-[0-9]{1,30})_([0-9]{1,40})/

  /*
    This matches any photo (not wallpost)
  */
  if (link.match(photoRegex)) {
    const [result, userId, photoId] = link.match(photoRegex)
    return {
      type: 'photo',
      userId,
      itemId: photoId
    }
  }

  /*
    This matches any wallpost on userpage (not in public page)
  */
  if (link.match(postRegex)) {
    const [result, userId, postId] = link.match(postRegex)
    return {
      type: 'post',
      userId,
      itemId: postId
    }
  }

  /*
    This matches any wallpost on public page (not in userpage)
  */
  if (link.match(groupPostRegex)) {
    const [result, userId, postId] = link.match(groupPostRegex)
    return {
      type: 'groupPost',
      userId,
      itemId: postId
    }
  }

  return {
    type: 'undefined',
    userId: 'undefined',
    itemId: 'undefined'
  }
}

async function isItemExist ({type, userId, itemId}) {
  if (!type || !userId || !itemId) return false
  switch (type) {
    case 'photo': return await isPhotoExist(userId, itemId)
    case 'post': return await isWallpostExist(userId, itemId)
    case 'groupPost': return await isWallpostExist(userId, itemId)
    default:
      console.error('something went wrong!')
      return false
  }
}

async function foo () {
  const links = [
    'https://vk.com/fletcherist?z=photo96170043_456239376%2Fphotos96170043',
    'https://vk.com/fletcherist?w=wall96170043_3051',
    'https://vk.com/tech?w=wall-147415323_713',
    'https://vk.com/vkcup?w=wall-41208167_1250'
  ]

  const parsedLinks = links.map(link => parseVKLink(link))
  for (const item of parsedLinks) {
    await delay(1000)
    console.log(await isItemExist(item))
  }

  // TODO: design schema for payment task
  const schema = {
    
  }
}

foo()

module.exports = {
  parseVKLink
}