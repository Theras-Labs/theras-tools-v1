import { Button, Tabs, TextInput } from "@mantine/core";
import React, { useEffect, useState, useRef } from "react";
import { Pagination } from "@mantine/core";
import { useSession, signIn, signOut } from "next-auth/react";
import useUserDetail from "src/store/useUserDetail";
import { useUserDataStore } from "src/store/useUserDetail";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
  orderBy,
  startAfter,
  limit,
} from "firebase/firestore";
import { db } from "firebase.config";
/* eslint-disable */

// you loggedin assigned:
// you are eligible to take number rounde 1:

function hideMiddleString(str) {
  if (str.length <= 5) {
    return str; // Return the original string if it's too short
  }

  const frontChars = str.slice(0, 3); // Get the first three characters
  const backChars = str.slice(-2); // Get the last two characters
  const middleChars = "*".repeat(str.length - 5); // Hide the middle characters

  return frontChars + middleChars + backChars;
}

// banned
export default ({ profile, handlerName, notFound }) => {
  const { data: session } = useSession();
  // useUserDetail();
  const { userData, loadUserData } = useUserDataStore();
  const { updateData, myNumber } = useUndian("undian");
  const { data: dataTotal, isLoading: loadingTotal } =
    useTotalMember("giveaway-data");

  useEffect(() => {
    if (session?.user) {
      const email = session.user.email;
      loadUserData(email, "web2"); // Pass the email to the loadUserData function
    }
  }, [session]);

  // addSocials: async (handler = "", handlerType = "", userID = "")
  return (
    <div className="border-red-500   w-full h-full p-8 lg:p-24 bg-main-blue">
      <div className=" mb-8 bg-secondary-gray p-8 rounded-md xl:w-2/3">
        <div className="grid grid-cols-1  xl:grid-cols-3 gap-20">
          {!session && (
            <div className="mr-20">
              You are not logged in yet,
              <br />
              <br />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  signIn();
                }}
                className="bg-purple-600"
              >
                Login
              </Button>
            </div>
          )}
          {session && (
            <>
              <div>
                Welcome, {session?.user?.name}
                <br />
                Email: {session?.user?.email}
                <br />
                <br />
                {!!userData && !userData?.twitter && !userData?.instagram && (
                  <SocialsForm />
                )}
              </div>
              <div className="capitalize ">
                Twitter: {(!!userData && userData?.twitter) ?? "-"}
                <br />
                IG: {(!!userData && userData?.instagram) ?? "-"}
                <br />
                <br />
                {[
                  "effort score",
                  "lucky score",
                  "badluck score",
                  "parasite score",
                  "loyalty score",
                  "challenger score",
                ].map((item, i) => (
                  <div
                    className={`${colorClasses[i % colorClasses.length]} `}
                    key={i}
                  >
                    {item}: -
                  </div>
                ))}
                <br />
                {session && (
                  <Button
                    onClick={() => {
                      signOut();
                    }}
                    className="bg-black"
                  >
                    Logout
                  </Button>
                )}
              </div>{" "}
            </>
          )}
          <div className=" ">
            Nomor urut undian: {(myNumber && myNumber?.number) ?? "-"}
            <br />
            <br />
            <Button
              onClick={async () => {
                //get nomor undian "giveaway-data"
                // dataTotal
                try {
                  if (!dataTotal) return alert("Something wrong");

                  const _profile = {
                    ...userData,
                    number: dataTotal?.total + 1,
                    round: "1",
                  };
                  console.log(_profile, "profile", dataTotal);
                  // set profile with nomor undian
                  updateData(_profile, dataTotal?.total + 1);
                  //and update nomor undian  "giveaway-data"
                } catch (error) {
                  console.log(error, "something wrong");
                }
              }}
              className="bg-red-700"
              disabled={
                (!userData?.instagram && !userData?.twitter) || myNumber
              }
            >
              Ambil nomor
            </Button>
            <div className="text-red-500">
              {session && userData
                ? userData?.instagram && userData?.twitter
                  ? ""
                  : "*kamu belom mengisi social media"
                : "*Kamu belom login"}
            </div>
          </div>
        </div>
      </div>

      <ListMember />
    </div>
  );
};

const SocialsForm = () => {
  const { addSocials, userID, userData } = useUserDataStore();
  const [instagram, setInstagram] = useState(null);
  const [instagramError, setInstagramError] = useState(null);
  const [twitter, setTwitter] = useState(null);
  const [twitterError, setTwitterError] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <>
      You haven't add your social media
      <div className="flex"></div>
      <TextInput
        error={twitterError}
        onChange={(e) => {
          setTwitter(e.target.value);
        }}
        className="mb-2"
        label="twitter"
      />
      <TextInput
        error={instagramError}
        onChange={(e) => {
          setInstagram(e.target.value);
        }}
        label="instagram"
      />
      <br />
      <Button
        loading={loading}
        disabled={loading}
        onClick={async () => {
          if (!twitter) return setTwitterError("Missing field");
          if (!instagram) return setInstagramError("Missing field");
          setLoading(true);
          try {
            const snapshot = await getDocs(
              query(collection(db, "users"), where("twitter", "==", twitter))
            );

            if (!snapshot.empty) {
              const results = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              throw Error(
                "Username is already taken by email:" + results[0]?.email
              );
            } else setTwitterError(null);
          } catch (error) {
            setLoading(false);
            return setTwitterError(error?.message);
          }
          try {
            const snapshot = await getDocs(
              query(
                collection(db, "users"),
                where("instagram", "==", instagram)
              )
            );
            if (!snapshot.empty) {
              const results = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              throw Error(
                "Username is already taken by email:" + results[0]?.email
              );
            } else setInstagramError(null);
          } catch (error) {
            console.log(error);
            setLoading(false);
            return setInstagramError(error?.message);
          }
          setLoading(false);

          if (!instagramError && !twitterError) {
            setLoading(true);

            addSocials(instagram, "instagram", userID);
            addSocials(twitter, "twitter", userID);
            setLoading(false);
          }
        }}
        className="bg-black"
      >
        Add
      </Button>
    </>
  );
};
const colorClasses = [
  "text-blue-500",
  "text-yellow-500",
  "text-red-500",
  "text-purple-500",
  "text-green-500",
  "text-pink-400",
];
function getRandomColorClass() {
  const randomIndex = Math.floor(Math.random() * brightColors.length);
  return brightColors[randomIndex];
}
// const colorClasses = ['bg-gray-100', 'bg-gray-200', 'bg-gray-300', 'bg-gray-400', 'bg-gray-500'];
const ListMember = () => {
  const [activePage, setPage] = useState(1);
  const { data: dataTotal, isLoading: loadingTotal } =
    useTotalMember("giveaway-data");
  const { data, myNumber } = useUndian("undian");
  // const { documents } = usePagination();
  // console.log(documents, "documents");
  return (
    <>
      <div className="my-6">
        Total round 1 join: {!!dataTotal && dataTotal?.total}
      </div>
      <Tabs defaultValue="round1">
        <Tabs.List>
          <Tabs.Tab value="round1">Round 1</Tabs.Tab>
          {[1, 1, 1, 1, 1].map((item, i) => (
            <Tabs.Tab key={i} value="nfts">
              Round {i + 2}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel value="round1" pt="xs">
          <div className="min-h-[400px] max-h-1/2 overflow-scroll">
            {data
              ?.sort((a, b) => b.number - a.number)
              .map((item, i) => (
                <div
                  className={`${colorClasses[i % colorClasses.length]} py-2`}
                >
                  # {item?.number}. &nbsp; &nbsp;{" "}
                  {hideMiddleString(item?.email)}&nbsp; &nbsp;{" "}
                  {hideMiddleString(item?.twitter)}&nbsp; &nbsp;{" "}
                  {hideMiddleString(item?.instagram)}
                </div>
              ))}
          </div>
          {/* <Pagination value={activePage} onChange={setPage} total={10} /> */}
        </Tabs.Panel>
        <Tabs.Panel value="nfts" pt="xs">
          <div className="min-h-[400px] text-center p-32">
            Round hasn't started yet
          </div>
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

// export async function getServerSideProps({ params }) {
//   //   const { slug } = params;
// }

export function useUndian(collectionName = "undian", handlerName = "") {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userID, userData } = useUserDataStore();
  const [error, setError] = useState(null);
  const [myNumber, setMyNumber] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    const q = query(collection(db, collectionName), where("round", "==", "1"));

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

  useEffect(() => {
    if (userData) {
      setIsLoading(true);
      const q = query(
        collection(db, collectionName),
        where("round", "==", "1"),
        where("email", "==", userData?.email)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const results = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMyNumber(results[0]);
          setIsLoading(false);
        },
        (error) => {
          setError(error);
          setIsLoading(false);
        }
      );

      return unsubscribe;
    }
  }, [collectionName, userData]);

  const updateData = async (_profile, total) => {
    const snapshot = await getDocs(
      query(
        collection(db, collectionName),
        where("round", "==", "1"),
        where("email", "==", _profile?.email)
      )
    );

    // console.log(snapshot, "Q ???", collectionName);
    if (snapshot.empty) {
      // if (true) {
      try {
        const collectionRef = collection(db, "undian");
        await addDoc(collectionRef, _profile);
        console.log('Document successfully added to "undian" collection!');

        const documentPath = `giveaway-data/iSEIFeg78VKBYOrjkfRb`;

        const documentRef = doc(db, documentPath);
        await setDoc(
          documentRef,
          {
            total,
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  return { data, isLoading, error, setData, updateData, myNumber };
}

export function useTotalMember(collectionName = "giveaway-data") {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    const q = query(collection(db, collectionName), where("round", "==", "1"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(results[0]);
        setIsLoading(false);
      },
      (error) => {
        setError(error);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName]);

  return { data, isLoading, error, setData };
}

// const usePagination = (pageSize = 20) => {
//   const [documents, setDocuments] = useState([]);
//   const [startAfterDocument, setStartAfterDocument] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchDocuments = async () => {
//     try {
//       setLoading(true);

//       const collectionRef = collection(db, "undian");
//       let queryRef = query(collectionRef, orderBy("number")); // Replace 'createdAt' with the field you want to order the documents by

//       if (startAfterDocument) {
//         queryRef = queryRef.startAfter(startAfterDocument);
//       }

//       queryRef = queryRef.limit(pageSize);

//       const querySnapshot = await getDocs(queryRef);
//       const newDocuments = [];

//       querySnapshot.forEach((doc) => {
//         const documentData = doc.data();
//         // Process and format the document data as needed
//         newDocuments.push(documentData);
//       });

//       setDocuments((prevDocuments) => [...prevDocuments, ...newDocuments]);

//       if (newDocuments.length > 0) {
//         setStartAfterDocument(newDocuments[newDocuments.length - 1]);
//       } else {
//         setStartAfterDocument(null);
//       }

//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching documents: ", error);
//       setError(error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   return { documents, loading, error, loadMore: fetchDocuments };
// };
