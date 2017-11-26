const { getInactiveUsers, removeUser } = require('../api/db/users')
const { db } = require('../parts/app')

async function removeInactiveUsers() {
  const usersObject = await getInactiveUsers()
  const users = Object.values(usersObject)
  users.sort((a, b) => a.createdAt < b.createdAt)
  users.forEach(user => console.log(user.createdAt))

  for (let user of users) {
    await removeUser(user.id)
    console.log(`${user.id} has been removed`)
  }
}

module.exports = removeInactiveUsers