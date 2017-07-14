const { db } = require('../parts/app')
const fetch = require('node-fetch')


async function parseVKLink (link) {
  const photoRegex = /=photo([0-9]{1,18})_([0-9]{1,40})%/
  const postRegex = /=wall([0-9]{1,18})_([0-9]{1,40})/
  const groupPostRegex = /=wall-([0-9]{1,30})_([0-9]{1,40})/

  if (link.match(photoRegex)) {
    console.log('PHOTO MATCHED', link.match(photoRegex))
  }

  else if (link.match(postRegex)) {
    console.log('POST MATCHED', link.match(postRegex))
  }

  else if (link.match(groupPostRegex)) {
    console.log('GROUP POST MATCHED', link.match(groupPostRegex))
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