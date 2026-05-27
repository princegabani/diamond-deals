import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

const ref = collection(db, "diamonds");

// Create
export const createDiamond = async (data) =>
    addDoc(ref, {
        ...data,
        status: "Available",
        createdAt: serverTimestamp(),
    });


// Read all
export const getDiamonds = async () => {
    const snap = await getDocs(ref);
    return snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    }));
};

// Read one
export const getDiamondById = async (id) => {
    const snap = await getDoc(doc(db, "diamonds", id));
    return { id: snap.id, ...snap.data() };
};

// Update
export const updateDiamond = async (id, data) =>
    updateDoc(doc(db, "diamonds", id), data);


// Delete
export const deleteDiamond = async (id) =>
    deleteDoc(doc(db, "diamonds", id));

