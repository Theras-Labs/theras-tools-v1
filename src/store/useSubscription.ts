//need this for data web3 combination
import { useEffect } from "react";
import { create } from "zustand";
import { useSession } from "next-auth/react";
// import { db } from "../../firebase.config";
import { collection, where, getDocs } from "firebase/firestore";

export const useStoreSubscription = create((set, get) => ({
  data: null,
  loading: false,
  error: null,
  loadSubscription: async () => {
    // const userData = get(useUserDataStore).userData;
    // if (userData) {
    //   // use userData.id as userID argument to fetch subscription data
    //   // ...
    // }
  },
}));
