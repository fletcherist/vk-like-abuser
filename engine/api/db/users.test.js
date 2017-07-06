const users = require('./users')

const {
  getUsers,
  getUser,
  isUserExist,

  deactivateUser,
  activateUser,
  getRandomUser
} = users

test(`# getUsers(limit) should get an array of users`, async () => {
  expect(Object.values(await getUsers(5)).length).toBe(5)
})

// Pavel Durov will never use our great service
test(`# getUser(id) should get any user by him/her id`, async () => {
  expect((await getUser(1))).toBeFalsy()
})

test('# isUserExist(id) should return true if user exist and false otherwise', async () => {
  expect((await isUserExist(101237829128))).toBe(false)
  expect((await isUserExist(123123123))).toBe(false)
})

//
test(`# deactivateUser() && activateUser() should deactivate any user`, async () => {
  const randomUser = await getRandomUser()
  const { id } = randomUser

  await deactivateUser(id)

  let user
  user = await getUser(id)
  expect(user.isActive).toBe(false)
  expect(user.isValid).toBe(false)

  await activateUser(id)

  user = await(getUser(id))
  expect(user.isActive).toBe(true)
  expect(user.isValid).toBe(true)

})

test(`# getRandomUser() should return random user`, async () => {
  expect(await (getRandomUser())).toBeDefined()
})