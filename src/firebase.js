// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeUcJH68PQfcAUjhLSgUmNiR1p6NzWdOI",
  authDomain: "shnl-fantasy.firebaseapp.com",
  projectId: "shnl-fantasy",
  storageBucket: "shnl-fantasy.firebasestorage.app",
  messagingSenderId: "875722552592",
  appId: "1:875722552592:web:9861eda507f8086f0ee195",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicijalizacija servisa
const auth = getAuth(app); // auth instanca
const db = getFirestore(app); // database instanca
// Izvoz servisa
export { auth, db };
