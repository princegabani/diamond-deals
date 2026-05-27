import { doc, setDoc, getDoc } from "firebase/firestore";

import { db } from "./firebase";

// Create user after signup
// export const createUser = async (data) => {
//     await setDoc(doc(db, "users", user.uid), {
//         email: user.email,
//         role,
//         createdAt: new Date(),
//     });
// };

// Get current user role
export const getUserRole = async (uid) => {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data().role : null;
};
