const { db } = require('../parts/app')
const fetch = require('node-fetch')

const { isWallpostExist } = require('../api/vk/wall')


async function parseVKLink (link) {
  const photoRegex = /=photo([0-9]{1,18})_([0-9]{1,40})%/
  const postRegex = /=wall([0-9]{1,18})_([0-9]{1,40})/
  const groupPostRegex = /=wall-([0-9]{1,30})_([0-9]{1,40})/

  if (link.match(photoRegex)) {
    console.log('PHOTO MATCHED', link.match(photoRegex))
  }

  else if (link.match(postRegex)) {
    const [result, userId, postId] = link.match(postRegex)
    const isExist = await isWallpostExist(userId, postId)
    if (isExist) {
      // Todo: create task here
      return console.log('POST MATCHED', link)
    }
  }

  else if (link.match(groupPostRegex)) {
    const [result, userId, postId] = link.match(groupPostRegex)
    const isExist = await isWallpostExist(userId, postId)
    if (isExist) {
      // Todo: create task here
      return console.log('GROUP POST MATCHED', link)
    }
  } else {
    console.log('NOT MATCHED')
  }


  return true
}

parseVKLink('https://vk.com/fletcherist?z=photo96170043_456239376%2Fphotos96170043')
parseVKLink('https://vk.com/fletcherist?w=wall96170043_3051')
parseVKLink('https://vk.com/tech?w=wall-147415323_713')
parseVKLink('https://vk.com/vkcup?w=wall-41208167_1250')

module.exports = {
  parseVKLink
}