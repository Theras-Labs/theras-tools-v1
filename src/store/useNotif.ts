import { notifications } from "@mantine/notifications";
import { useUserDataStore } from "./useUserDetail";
import { useEffect } from "react";
import { create } from "zustand";
import { db } from "../../firebase.config";
import {
  collection,
  where,
  getDocs,
  query,
  doc,
  getDoc,
} from "firebase/firestore";

// welcome notif read
export const useNotifStore = create((set) => ({
  data: [],
  loading: true,
  loadNotifs: async (id: any) => {
    set({ loading: true, error: null });
    try {
      const documentSnapshot = await getDocs(
        query(collection(db, "notifications"), where("userId", "==", id))
      );
      if (!documentSnapshot.empty) {
        const notifs = documentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(notifs, "notifs", id);

        set({
          data: notifs,
          loading: false,
        });
      }
    } catch (error) {
      console.log(error, "ERROR STORE USER");
      set({ data: [], loading: false, error: error?.message });
    }
  },
}));

// setup auth on courses
export const useNotif = () => {
  const data = useNotifStore((state: any) => state?.courses);
  const loading = useNotifStore((state: any) => state?.loading);
  const loadNotifs = useNotifStore((state: any) => state?.loadNotifs);
  const userData = useUserDataStore((state: any) => state?.userData);

  useEffect(() => {
    if (!!userData) {
      // console.log(userData, subscription, "WTF");
      loadNotifs(userData?.id);
    }
  }, [userData]);

  return {
    data,
    loading,
    // courses_type: session?.user?.subscription?.tier,
  };
};
