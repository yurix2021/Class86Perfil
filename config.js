import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDR9q6GyZJx9G4Qr4GXnD7vessohcQ1rAI",
  authDomain: "cuenta-cuentos-nicol.firebaseapp.com",
  databaseURL: "https://cuenta-cuentos-nicol-default-rtdb.firebaseio.com",
  projectId: "cuenta-cuentos-nicol",
  storageBucket: "cuenta-cuentos-nicol.appspot.com",
  messagingSenderId: "1047839048800",
  appId: "1:1047839048800:web:d764abcc859a30e9ff6f05"
};

if(!firebase.apps.lenght){
  firebase.initializeApp(firebaseConfig);
}
export default firebase.database();