// const firebaseConfig = {
//   apiKey: "AIzaSyCnXDc93ue6ArfLM9fgyYlYMqz6l1Xe_vk",
//   authDomain: "drawai-e9ec7.firebaseapp.com",
//   databaseURL: "https://drawai-e9ec7-default-rtdb.firebaseio.com",
//   projectId: "drawai-e9ec7",
//   storageBucket: "drawai-e9ec7.appspot.com",
//   messagingSenderId: "172795787297",
//   appId: "1:172795787297:web:cc3048da1d055ac8838b60"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app)

import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js'
import {firebaseConfig} from './config.js'
import {getDatabase} from'https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js'

class FirebaseApp{
  constructor(){
    this.app = initializeApp(firebaseConfig)
    this.db = getDatabase(this.app)
  }
}

export {FirebaseApp}
