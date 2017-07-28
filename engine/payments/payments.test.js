const { validateVKLink } = require('./payments')

test('validateVKLink', async () => {
  expect(await validateVKLink()).toBe(true)
})