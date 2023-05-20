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
  setDoc,
  updateDoc,
} from "firebase/firestore";

// welcome notif read
export const useProgressStore = create((set, get) => ({
  playlistProgress: [],
  dataProgress: null,
  loading: true,
  loadProgress: async (id: any) => {
    set({ loading: true, error: null });
    try {
      const documentSnapshot = await getDoc(doc(db, "progress", id));

      set({
        dataProgress: documentSnapshot?.data(),
        loading: false,
      });
    } catch (error) {
      console.log(error, "ERROR STORE USER");
      set({ loading: false, error: error?.message });
    }
  },
  updateProgress: async (user_id, category_id, course_id, order_index) => {
    try {
      const retreiveProgress = !!get()?.dataProgress?.[category_id]
        ? get()?.dataProgress?.[category_id]?.progress
        : [];

      const playlistProgress = get()?.playlistProgress;

      const prevProgress = [...retreiveProgress, ...playlistProgress];

      // check if it's not in the progress yet
      const alreadyExists = prevProgress.find(
        (item) => item?.course_id === course_id
      );

      if (alreadyExists) return;

      const now = new Date();
      const unixTimestamp = Math.floor(now.getTime() / 1000);
      const currentProgress = [
        ...prevProgress,
        {
          updatedAt: unixTimestamp,
          course_id,
          category_id,
        },
      ] as any;

      const payload = {
        [category_id]: {
          current_id: course_id,
          //   next_course: next_course_id,
          current_index: order_index,
          progress: currentProgress
            ?.filter((o) => o.category_id === category_id)
            .filter(
              (value, index, arr) =>
                arr.findIndex((item) => item.course_id === value.course_id) ===
                index
            ),
          timeplay: null,
          updatedAt: unixTimestamp,
        },
      };

      // update docs with id of users and name of id_course
      const progressRef = doc(db, "progress", user_id);
      // const progressSnapshot = await getDoc(progressRef);
      await setDoc(progressRef, payload, { merge: true });
      set({ playlistProgress: currentProgress });
    } catch (error) {
      console.log(error);
    }
  },
}));

// setup auth on courses
export const useProgress = () => {
  const loading = useProgressStore((state: any) => state?.loading);
  const loadProgress = useProgressStore((state: any) => state?.loadProgress);
  const userData = useUserDataStore((state: any) => state?.userData);

  useEffect(() => {
    if (!!userData) {
      loadProgress(userData?.id);
    }
  }, [userData]);

  return {
    loading,
    // courses_type: session?.user?.subscription?.tier,
  };
};
