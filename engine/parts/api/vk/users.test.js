const users = require('./users')
const {
  getUser,
  checkUserDeactivated,
} = users

test(`# ${getUser.name} should get object with user`, async () => {
  // Pavel Durov should always be ok!
  expect(typeof await getUser(1)).toBe('object')

  // Random man should bot be as ok
  expect(await getUser(22222222222)).toBeFalsy()

})

test(`# ${checkUserDeactivated.name} should better work`, async () => {
  // Should recieve error whether no userId provided
  expect(await checkUserDeactivated()).toBe(false)

  // Pavel Durov should always be ok!
  expect(await checkUserDeactivated(1)).toBe(false)
})
