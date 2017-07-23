const { getUser } = require('../api/db/users')

const VK = require('./vk')

const TEST_VK_ID = '96170043'
const TEST_TARGET_ID = '456239376'

describe('VK module', async () => {
  test('VK module should exist', () => {
    expect(typeof VK).toBe('function')
  })

  test('Test like method', async () => {
    const user = await getUser(TEST_VK_ID)
    const { access_token } = user
    const vk = new VK(access_token)
    try {
      await vk.like({
        type: 'photo',
        id: TEST_TARGET_ID,
        target: TEST_VK_ID
      })
    } catch(e) {
      throw new Error(e)
    }
  })

  test('Test dislike method', async () => {
    const user = await getUser(TEST_VK_ID)
    const { access_token } = user
    const vk = new VK(access_token)
    try {
      await vk.dislike({
        type: 'photo',
        id: TEST_TARGET_ID,
        target: TEST_VK_ID
      })
    } catch (e) {
      throw new Error(e)
    }
  })
})