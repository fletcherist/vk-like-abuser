const firebase = require('firebase')
const firebaseConfig = require('../config').firebase

const admin = require('firebase-admin')
const serviceAccount = require('../firebase-key.json')

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseConfig.databaseURL
});

// let app = firebase.initializeApp(firebaseConfig)

module.exports = app