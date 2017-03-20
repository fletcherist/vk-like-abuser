import firebase from 'firebase/app'
import 'firebase/database'
console.warn(firebase)

var config = {
  apiKey: 'AIzaSyB1IjoxSLvx-C_hpyQ2irgzB01Tf3bts3I',
  authDomain: 'vk-free-likes.firebaseapp.com',
  databaseURL: 'https://vk-free-likes.firebaseio.com',
  storageBucket: 'vk-free-likes.appspot.com',
  messagingSenderId: '19336089245'
}

let app = {}
let _db = {}
if (firebase) {
  app = firebase.initializeApp(config)
  _db = firebase.database()
}

export const db = _db

export default app
