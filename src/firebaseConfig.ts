import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import getAuth from firebase/auth
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBLTEdXonNg3tNXDi7Bb7R1ZGBMae1R6Bg",
    authDomain: "taskmanager-39c9b.firebaseapp.com",
    projectId: "taskmanager-39c9b",
    storageBucket: "taskmanager-39c9b.appspot.com",
    messagingSenderId: "951186395121",
    appId: "1:951186395121:web:75f3bb698e793e3a94be50",
    measurementId: "G-WJNGYWLCNH"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Get the auth instance
export const db = getFirestore(app); // Get the Firestore database instance

const analytics = getAnalytics(app);
