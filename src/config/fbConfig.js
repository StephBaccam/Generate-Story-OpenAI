// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXOVOj3w1BYMgxXj4WGqjIFBfLbklqhFs",
  authDomain: "generate-story-openai.firebaseapp.com",
  projectId: "generate-story-openai",
  storageBucket: "generate-story-openai.appspot.com",
  messagingSenderId: "627518782620",
  appId: "1:627518782620:web:b86280c2a493d171a90159",
  measurementId: "G-X28PFZRV85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);