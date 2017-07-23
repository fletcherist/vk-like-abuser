const VKapi = require('node-vkapi')
const { log } = require('../../parts/console')

const api = new VKapi()

async function getLikesList({
  type,
  ownerId,
  itemId
}) {
  try {
    const likesList = await api.call('likes.getList', {
      type,
      owner_id: ownerId,
      item_id: itemId,
      count: 99999
    })

    const { count, items } = likesList
    return items
  } catch (e) {
    throw new Error(e)
  }
} 



async function removeLikes () {
  try {
    const likesList = await getLikesList({
      type: 'photo',
      ownerId: '96170043',
      itemId: '456239376'
    })
    // TODO: write some remove logic
  } catch (e) {

  }
}

removeLikes()

module.exports = {
  getLikesList
}