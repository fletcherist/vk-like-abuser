const firebase = require('firebase')
const firebaseConfig = require('../firebaseConfig')

let app = firebase.initializeApp(firebaseConfig)

module.exports = app