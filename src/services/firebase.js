// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "minimal-shared/utils";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDSWBLmd29iqH6CoX3uEt75jErTp-g1fc8",
    authDomain: "pandora-a31ad.firebaseapp.com",
    databaseURL: "https://pandora-a31ad-default-rtdb.firebaseio.com",
    projectId: "pandora-a31ad",
    storageBucket: "pandora-a31ad.firebasestorage.app",
    messagingSenderId: "114966638040",
    appId: "1:114966638040:web:2d20ac2ec23181d2e696ad",
    measurementId: "G-M5QXCL4EZ3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);