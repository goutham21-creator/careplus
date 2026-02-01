/* 
 * CarePlus Hospital - Firebase Configuration
 * Phase 2: Integrated with live Firebase Project
 */

// Import SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBw307B7YinKTEJk-2aCT4APtnUao2x1Hg",
    authDomain: "careplus-hospital.firebaseapp.com",
    projectId: "careplus-hospital",
    storageBucket: "careplus-hospital.firebasestorage.app",
    messagingSenderId: "774597253903",
    appId: "1:774597253903:web:2b8a3cd9387525eb38fc7a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize & Export Services
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("Firebase initialized successfully");
