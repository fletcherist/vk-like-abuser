import firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyB1IjoxSLvx-C_hpyQ2irgzB01Tf3bts3I',
  authDomain: 'vk-free-likes.firebaseapp.com',
  databaseURL: 'https://vk-free-likes.firebaseio.com',
  storageBucket: 'vk-free-likes.appspot.com',
  messagingSenderId: '19336089245'
}

const app = firebase.initializeApp(config)
export const db = firebase.database()

export default app
