import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Blockquote,
  Button,
  Code,
  Container,
  Divider,
  Select,
  Skeleton,
  TextInput,
  Textarea,
} from "@mantine/core";
import { Tabs } from "@mantine/core";
import { db, storage } from "../../../firebase.config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { notifications } from "@mantine/notifications";
import CryptoSection from "src/components/send/CryptoSection";
import { useAccount } from "wagmi";

/* eslint-disable */
// if starts as 0x

const COLOR_OPTIONS_VISA = [
  "bg-orange-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-green-500",
];
export default ({ profile, handlerName }) => {
  // load user data from params:
  const router = useRouter();
  //   router.query.slug

  const [state, setState] = useState({
    message: "",
    fromName: "",
    value: null,
  });
  const { address } = useAccount();

  return (
    <div className="border-red-500   w-full min-h-screen h-full p-8 lg:p-24 bg-main-blue">
      {/* NETWORK, CONNECT -> LOGIN
THERAS */}
      <Container>
        <div className="bg-secondary-gray my-4 rounded-md font-bold p-10">
          Profile: {profile?.handler}
          {/* DETECT RUN SESSION OR NOT */}
        </div>

        {/* form amount */}
        <div className="bg-secondary-gray rounded-md font-bold p-10">
          {/* Nominal amount */}
          {/* TABS: THETA | VISA */}
          <Tabs defaultValue="crypto">
            <Tabs.List>
              <Tabs.Tab value="crypto">Crypto</Tabs.Tab>
              <Tabs.Tab value="cards">Cards</Tabs.Tab>
              <Tabs.Tab value="nfts">NFTs</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="crypto" pt="xs">
              <CryptoSection
                {...{
                  state,
                  setState,
                }}
              />
            </Tabs.Panel>
            <Tabs.Panel value="cards" pt="xs">
              {/* Visa types */}
              <div className="flex space-x-2">
                {[5, 10, 20, 50, 100].map((item, i) => (
                  <Button key={i} className={`${COLOR_OPTIONS_VISA[i]}`}>
                    ${item}
                  </Button>
                ))}
              </div>
              or
              <div className="flex">
                <TextInput
                  // disabled
                  // disabled={!!select}
                  // value={!!select ? select?.category_title : state?.category_title}
                  onChange={(e) =>
                    setState({ ...state, value: e.target.value })
                  }
                  placeholder="$1000"
                  label="Custom amount"
                />
              </div>
            </Tabs.Panel>
            <NFToptions />
          </Tabs>
          <br />

          <Divider
            my="xs"
            label="Fill the sender info"
            labelPosition="center"
          />
          <br />
          {address && (
            <div className="flex">
              Wallet Address: &nbsp;{" "}
              <span className="text-green-600">{address}</span>
            </div>
          )}
          <br />
          <FormSender
            {...{
              state,
              setState,
            }}
          />
          <br />

          {/* INFORM AGAIN CRYPTO AND VISA info */}
          <Button
            onClick={async () => {
              // if pay with cards

              //if pay with visa
              if (!state?.value && !state?.fromName)
                return notifications.show({
                  message: `Missing fields `,
                });

              //push notification
              // TODO: MOVE IT INTO API
              const collectionPath = "widget-msg"; // Replace "collectionName" with the name of your Firestore collection
              const newData = {
                message: state?.message,
                to: handlerName,
                read: false,
                value: state?.value,
                payment: "card", // card | token | nft
                createdAt: Math.floor(Date.now() / 1000),
                // Add more fields and values as needed
                //createdBy: email | id | real name

                test: false,
                from: state?.fromName, //send_as
                //fromUsername:
                // address: email | eth_address
                // tx_hash:
                // Add more fields and values as needed
              };
              try {
                const docRef = await addDoc(
                  collection(db, collectionPath),
                  newData
                );
                console.log("Document created with ID: ", docRef.id);
                //   set({ handler, handlerID: docRef.id });
              } catch (error) {
                console.error("Error creating document: ", error);
              }

              notifications.show({
                message: `Sending notification `,
              });
            }}
            // disabled
            className="bg-red-600"
          >
            Send
          </Button>

          {/* media?? */}
        </div>
      </Container>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const { slug } = params;

  try {
    // Query Firestore based on the handler property
    const q = query(collection(db, "handler"), where("handler", "==", slug[0]));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Data exists for the provided slug
      const profile = [];

      querySnapshot.forEach((doc) => {
        profile.push({ id: doc.id, ...doc.data() });
      });

      return {
        props: {
          profile: profile[0],
          handlerName: slug[0],
        },
      };
    } else {
      // Data does not exist for the provided slug
      return {
        notFound: true,
      };
    }
  } catch (error) {
    console.error("Error fetching data: ", error);

    return {
      notFound: true,
    };
  }
}

// LOAD USERS

const FormSender = ({ state, setState, loading }) => {
  return (
    <>
      <TextInput
        // disabled={!!select}
        // value={!!select ? select?.category_title : state?.category_title}
        onChange={(e) => setState({ ...state, fromName: e.target.value })}
        placeholder="Fans No.1"
        label="Send As"
        withAsterisk
      />
      <br />
      <Textarea
        // disabled={!!select}
        // value={!!select ? select?.category_title : state?.category_title}
        onChange={(e) => setState({ ...state, message: e.target.value })}
        placeholder=""
        label="Msg"
        withAsterisk
      />
    </>
  );
};

const NFToptions = () => {
  return (
    <Tabs.Panel value="nfts" pt="xs">
      <Blockquote color="pink">NFT option is currently unavailable</Blockquote>
      <br />
      NFT-1155
      <br />
      {/* use from arcade games: Theras */}
      <div className="flex">
        <Select
          disabled
          label="Theras Arcades Game"
          placeholder="Star XYZ"
          data={[
            { value: "star", label: "Star XYZ" },
            { value: "kings", label: "King of Kings" },
            { value: "mtv", label: "MTV" },
            { value: "city", label: "City Staking" },
          ]}
        />

        <div className="flex gap-2 flex-wrap ml-2">
          <div>
            X-FUEL
            <Skeleton height={100} width={100} />
          </div>
          <div>
            Y-FUEL
            <Skeleton height={100} width={100} />
          </div>
          <div>
            X-AMMO
            <Skeleton height={100} width={100} />
          </div>
        </div>
      </div>
      <br />
      or
      <div className="flex space-x-2">
        <TextInput disabled placeholder="0x..." label="NFT address" />
        <TextInput disabled placeholder="1" label="Token id" />
        <TextInput disabled placeholder="1" label="Amount" />
      </div>
    </Tabs.Panel>
  );
};
