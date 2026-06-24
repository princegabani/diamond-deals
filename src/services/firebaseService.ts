// services/firebaseService.ts
import {
    ref,
    set,
    push,
    get,
    update,
    remove,
    onValue,
    child,
    query,
    orderByChild,
    equalTo,
} from "firebase/database";

import { database, storage } from "./firebase";

class FirebaseService {
    // ---------------------------
    // CREATE (add item)
    // ---------------------------
    async add(path: string, data: any) {
        const newRef = push(ref(database, path));
        await set(newRef, {
            id: newRef.key,
            ...data,
        });
        return newRef.key;
    }

    // ---------------------------
    // CREATE (add to storage)
    // ---------------------------



    // ---------------------------
    // SET (overwrite full object)
    // ---------------------------
    async set(path: string, data: any) {
        await set(ref(database, path), data);
    }

    // ---------------------------
    // GET ONCE
    // ---------------------------
    async getOnce(path: string) {
        const snapshot = await get(ref(database, path));
        return snapshot.exists() ? snapshot.val() : null;
    }

    // ---------------------------
    // UPDATE
    // ---------------------------
    async update(path: string, data: any) {
        await update(ref(database, path), data);
    }

    // ---------------------------
    // DELETE
    // ---------------------------
    async delete(path: string) {
        await remove(ref(database, path));
    }

    // ---------------------------
    // REALTIME LISTENER
    // ---------------------------
    listen(path: string, callback: (data: any) => void) {
        const dbRef = ref(database, path);

        return onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });
    }

    // ---------------------------
    // GET AS ARRAY (IMPORTANT)
    // ---------------------------
    async getArray(path: string) {
        const snapshot = await get(ref(database, path));

        if (!snapshot.exists()) return [];

        const data = snapshot.val();

        return Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
        }));
    }

    // ---------------------------
    // QUERY BY FIELD
    // ---------------------------
    async queryBy(path: string, field: string, value: any) {
        const q = query(ref(database, path), orderByChild(field), equalTo(value));

        const snapshot = await get(q);

        if (!snapshot.exists()) return [];

        const data = snapshot.val();

        return Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
        }));
    }
}

export const firebaseService = new FirebaseService();





// . HOW YOU USE IT (IN TSX)

// 👉 Add data
// await firebaseService.add("users", {
//   name: "Prince",
//   age: 25,
// });

// const data = await firebaseService.getOnce("users");
// console.log(data);


// 👉 Get array (VERY IMPORTANT for lists)
// const users = await firebaseService.getArray("users");
// console.log(users);

// 👉 Listen realtime
// useEffect(() => {
//   const unsub = firebaseService.listen("users", (data) => {
//     console.log("Realtime:", data);
//   });
//   return () => unsub();
// }, []);

// 👉 Update
// await firebaseService.update("users/userId", {
//   name: "Updated Name",
// });

// 👉 Delete
// await firebaseService.delete("users/userId");