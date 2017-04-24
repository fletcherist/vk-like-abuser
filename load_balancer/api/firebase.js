const admin = require('firebase-admin')
const serviceAccount = require('../firebase-key.json')

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://vk-free-likes.firebaseio.com'
})

const db = app.database()

module.exports = {
    db
}