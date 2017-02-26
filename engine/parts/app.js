const firebase = require('firebase')
const firebaseConfig = require('../config').firebase

let app = firebase.initializeApp(firebaseConfig)

module.exports = app