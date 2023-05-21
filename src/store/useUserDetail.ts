import { setLargeCookie } from "src/lib/helpers/store-cookie";
import { useEffect } from "react";
import { create } from "zustand";
import { useSession } from "next-auth/react";
import { db } from "../../firebase.config";
import {
  collection,
  where,
  getDocs,
  query,
  doc,
  setDoc,
} from "firebase/firestore";
import Cookies from "js-cookie";
import { notifications } from "@mantine/notifications";

export const useUserDataStore = create((set, get) => ({
  userData: null,
  loading: true,
  error: null,
  errorSocials: null,
  userID: null,
  subscription: null,
  subscriptionActive: null,
  type: null, // email | eth_address
  setLoading: (val: boolean) => set({ loading: val }),
  setLogout: () =>
    set({
      userData: null,
      loading: false,
      error: null,
      userID: null,
      subscription: null,
      subscriptionActive: null,
      type: null, // email | eth_address
    }),
  setError: (val: Error) => set({ error: val }),
  setWeb3Data: (userData: any, type: any) => {
    set({
      userData,
      type,
      subscription: userData.subscription,
      subscriptionActive: !!userData.subscription,
    });
  },
  loadUserData: async (email: string, type?: any) => {
    // try to get email from cookie
    set({ loading: true, error: null });

    // identify web2 users or web3
    // this is for web2
    if (type === "web2")
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "users"), where("email", "==", email))
        );

        if (querySnapshot.empty) {
          set({ userData: null, loading: false });
        } else {
          const docSnapshot = querySnapshot.docs[0];

          if (docSnapshot) {
            const userData = { id: docSnapshot.id, ...docSnapshot.data() };
            const subscription = docSnapshot?.data()?.subscription;
            const unixTimestamp = Math.floor(Date.now() / 1000);

            const subscriptionActive =
              !!subscription && Number(subscription?.expiredAt) > unixTimestamp;

            const payload = {
              userData,
              userID: docSnapshot.id,
              subscription,
              subscriptionActive,
              loading: false,
            };
            set({ ...payload });
            // Set user data in a cookie
            // Cookies.set("cookie_userData", JSON.stringify(payload));

            setLargeCookie("cookie_userData", payload);
          } else {
            set({ userData: null, loading: false });
          }
        }
      } catch (error) {
        console.log(error, "ERROR STORE USER");
      }
  },

  addSocials: async (handler = "", handlerType = "", userID = "") => {
    set({ loading: true, error: null });

    const documentPath = `users/${userID}`;
    const updatedFields = {
      [handlerType]: handler,
    };

    const documentRef = doc(db, documentPath);

    notifications.show({
      message: "sucess",
    });

    try {
      await setDoc(documentRef, updatedFields, { merge: true });
      console.log("Document handlerType  successfully updated!");
      set({
        userData: { ...get().userData, ...updatedFields },
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  },
}));

// deprecated ?
export default function useUserDetail() {
  const { data: session } = useSession();
  const { loadUserData, loading, userData } = useUserDataStore(
    (state) => state
  );

  useEffect(() => {
    if (session?.user) {
      const email = session.user.email;
      loadUserData(email); // Pass the email to the loadUserData function
    }
  }, [session]);

  return {
    loading,
    userData,
  };
}
