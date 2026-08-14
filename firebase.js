// =============================================
// FIREBASE CONFIGURATION - الإصدار النهائي
// =============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    onSnapshot,
    serverTimestamp,
    Timestamp,
    limit,
    limitToLast
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// =============================================
// CONFIG
// =============================================
const firebaseConfig = {
    apiKey: "AIzaSyAmiuvUSKY-UPL_oD7FOgQUOUh1-lRUANo",
    authDomain: "nova-currency-app.firebaseapp.com",
    projectId: "nova-currency-app",
    storageBucket: "nova-currency-app.firebasestorage.app",
    messagingSenderId: "633638757418",
    appId: "1:633638757418:web:e221ce88973f8665c68f53",
    measurementId: "G-SR7RJTVKDN"
};

// =============================================
// INITIALIZE
// =============================================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// إعدادات Google Provider
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// =============================================
// EXPORTS - كل ما تحتاجه التطبيق
// =============================================
export { 
    // Auth
    auth, 
    googleProvider,
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    
    // Firestore
    db,
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    onSnapshot,
    serverTimestamp,
    Timestamp,
    limit,
    limitToLast,
    
    // Storage
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
};