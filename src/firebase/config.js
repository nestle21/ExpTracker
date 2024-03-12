// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdznMu7IWQ5jmZIYuzxEa313o0VwKKKM4",
  authDomain: "tracker-5244d.firebaseapp.com",
  projectId: "tracker-5244d",
  storageBucket: "tracker-5244d.appspot.com",
  messagingSenderId: "78085880504",
  appId: "1:78085880504:web:6a709f90a87e3c58e8d24d",
  measurementId: "G-1YQWFKXKYT"
};


initializeApp(firebaseConfig);

const db = getFirestore();
export default db