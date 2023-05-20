import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "../../../firebase.config";

import { useEffect, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { notifications } from "@mantine/notifications";

// Initialize Firebase Storage
// const storage = getStorage();
// const storageRef = ref(storage);
// const imagesRef = ref(storageRef, "images");

export function useWidget(collectionName = "widget", handlerName = "") {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    const q = query(
      collection(db, collectionName),
      where("to", "==", handlerName),
      where("read", "==", false)
    );
    console.log(collectionName, handlerName);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(results);
        setIsLoading(false);
      },
      (error) => {
        setError(error);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName]);

  const setArchive = async (id) => {
    const documentPath = `${collectionName}/${id}`;
    const updatedFields = {
      read: true,
    };

    const documentRef = doc(db, documentPath);

    try {
      await setDoc(documentRef, updatedFields, { merge: true });
      console.log("Document msg successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return { data, isLoading, error, setData, setArchive };
}
