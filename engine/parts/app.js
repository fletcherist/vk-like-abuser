const admin = require('firebase-admin')

const firebaseConfig = require('../config').firebase
const serviceAccount = require('../firebase-key.json')

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseConfig.databaseURL
})

const db = app.database()

module.exports = app
module.exports.db = db