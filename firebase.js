console.log("firebase.js başladı");

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyASrc6oTod2cmThLCVE9eq67WYXECjUs-s",
    authDomain: "rpdevlet.firebaseapp.com",
    projectId: "rpdevlet",
    storageBucket: "rpdevlet.firebasestorage.app",
    messagingSenderId: "501270072690",
    appId: "1:501270072690:web:8983515980d91a23cae1eb",
    measurementId: "G-3VJBVJ7RDV"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export {
    auth,
    db,

    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,

    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,

    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,

    addDoc,
    serverTimestamp
};