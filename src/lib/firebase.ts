import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDRjEHZ3T8zUaAjABKrxjcR9AzJsCO3KDA",
  authDomain: "whole-mart-473e7.firebaseapp.com",
  projectId: "whole-mart-473e7",
  storageBucket: "whole-mart-473e7.firebasestorage.app",
  messagingSenderId: "790658749256",
  appId: "1:790658749256:web:addf6c97ac451a98ce597d",
  measurementId: "G-K3MEK9HVHM"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
