// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBNSbsWuynoRasrDxOz5A_5sUROpipO6A8',
  authDomain: 'auth.congasgh.com',
  projectId: 'congas-webapp',
  storageBucket: 'congas-webapp.appspot.com',
  messagingSenderId: '883325992993',
  appId: '1:883325992993:web:e1d8d5bb51862f878be360',
  measurementId: 'G-1LLQ84RF75',
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const storage = getStorage()