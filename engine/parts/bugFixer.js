const DB = require('./db')

const db = new DB().db
db.ref('/users').once('value', snap => {
  const users = snap.val()
  for (let userId in users) {
    // console.log(users[userId])
    const user = users[userId]
    const { id, access_token } = user
    if (!id) {
      console.log(userId)
      db.ref(`/users/${userId}/id`)
        .transaction(currentValue => parseInt(userId))
    }

    // if (!access_token) {
    //   db.ref(`/users/${userId}`).remove()
    // }
  }
})