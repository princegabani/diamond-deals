
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";

import { db } from "./firebase";

const auth = getAuth();

// Register Staff / Admin
export const registerUser = async ({ email, password, name, role, status }) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", res.user.uid), {
        name,
        email,
        role, // admin | staff
        status: status ?? 'Active',
        createdAt: serverTimestamp(),
    });

    return res.user;
};

// Login
export const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    console.log('user detail---', res.user.uid)
    localStorage.setItem("uid", res.user.uid);
    return res.user;
};

// Logout
export const logout = async () =>
    await signOut(auth);

// Current user
export const getCurrentUser = () =>
    auth.currentUser;


// Get user profile + role
export const getUserProfile = async (uid) => {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
};

// Auth listener (for context)
export const subscribeAuth = (callback) =>
    onAuthStateChanged(auth, callback);
