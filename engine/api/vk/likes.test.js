const {
  getLikesList
} = require('./likes')

TEST_TYPE = 'photo'
TEST_OWNER_ID = '96170043'
TEST_ITEM_ID = '456239376'

test('getLikestList', async () => {
  const likesList = await getLikesList({
    type: TEST_TYPE,
    ownerId: TEST_OWNER_ID,
    itemId: TEST_ITEM_ID
  })
  
  expect(Array.isArray(likesList)).toBe(true)
})
