import { COURSES } from "src/mock/courses";
import Cookies from "js-cookie";
import { useUserDataStore } from "./useUserDetail";
import { useEffect } from "react";
import { create } from "zustand";
import { useSession } from "next-auth/react";
import { db } from "../../firebase.config";
import { collection, where, getDocs, query } from "firebase/firestore";
import { setLargeCookie } from "src/lib/helpers/store-cookie";

interface Membership {
  string: "basic" | "silver" | "gold" | "diamond";
}

export const useCoursesStore = create((set) => ({
  courses_category: [],
  courses: [],
  loading: true,
  loadCourses: async (membership_type: Membership) => {
    set({ loading: true, error: null });
    // console.log("load courses", membership_type, "membership_type");
    try {
      const categorySnapshot = await getDocs(
        query(
          collection(db, "category-courses"),
          where("membership_type", "==", membership_type)
        )
      );
      const coursesSnapshot = await getDocs(
        query(
          collection(db, "courses"),
          where("membership_type", "==", membership_type)
        )
      );
      if (categorySnapshot.empty) {
        set({ courses_category: null, loading: false });
      } else {
        const categoryCourses = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const detailCourses = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const payload = {
          courses_category: categoryCourses,
          courses: detailCourses,
          loading: false,
        };

        console.log(payload, "payload");

        set({ ...payload });
        setLargeCookie("COURSES", payload);
      }
    } catch (error) {
      console.log(error, "ERROR STORE USER");
      set({ courses_category: null, loading: false, error: error?.message });
    }
  },
}));

// setup auth on courses
export const useCourses = () => {
  const data = useCoursesStore((state: any) => state?.courses);
  const loading = useCoursesStore((state: any) => state?.loading);
  const loadCourses = useCoursesStore((state: any) => state?.loadCourses);
  const subscription = useUserDataStore((state: any) => state?.subscription);
  const subscriptionActive = useUserDataStore(
    (state: any) => state?.subscriptionActive
  );
  const userData = useUserDataStore((state: any) => state?.userData);

  useEffect(() => {
    if (!!userData) {
      // console.log(userData, subscription, "WTF");
      loadCourses(
        !subscriptionActive
          ? "basic"
          : !subscription
          ? "basic"
          : subscription?.tier
      );
    }
  }, [subscription, userData]);

  return {
    data,
    loading,
    // courses_type: session?.user?.subscription?.tier,
  };
};
