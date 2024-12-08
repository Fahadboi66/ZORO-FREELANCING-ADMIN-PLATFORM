// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-stack-auth-8cf44.firebaseapp.com",
  projectId: "mern-stack-auth-8cf44",
  storageBucket: "mern-stack-auth-8cf44.appspot.com",
  messagingSenderId: "362690582642",
  appId: "1:362690582642:web:9f9bc1f63b5eb2b7b94aeb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);