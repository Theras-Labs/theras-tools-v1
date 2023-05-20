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

  return (
    <div className="bg-main-blue w-full h-full my-10">
      {/* NETWORK, CONNECT -> LOGIN
THERAS */}
      <Container>
        <div className="bg-secondary-gray my-4 rounded-md font-bold p-10">
          Profile: {profile?.handler}
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
              <CryptoContent />
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
                  disabled
                  // disabled={!!select}
                  // value={!!select ? select?.category_title : state?.category_title}
                  // onChange={(e) => setState({ ...state, category_title: e.target.value })}
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
          <FormSender />
          <br />

          {/* INFORM AGAIN CRYPTO AND VISA info */}
          <Button
            onClick={async () => {
              //push notification
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
            disabled
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

const CryptoContent = () => {
  // const
  return (
    <div className="">
      <Code>The amount will be auto convert to wei</Code>
      <br />
      <br />
      <div className="flex items-end ">
        <TextInput
          // disabled={!!select}
          // value={!!select ? select?.category_title : state?.category_title}
          // onChange={(e) => setState({ ...state, category_title: e.target.value })}
          placeholder="Amount"
          label="Send TFUEL"
        />
        {/* <Button className="bg-red-600 ml-2">Send</Button> */}
      </div>
      or
      <div className="flex items-end ">
        <TextInput
          className="mr-2"
          // disabled={!!select}
          // value={!!select ? select?.category_title : state?.category_title}
          // onChange={(e) => setState({ ...state, category_title: e.target.value })}
          placeholder="Amount"
          label="Send TNT-20"
        />
        <Select
          label="Coin"
          defaultValue="WETH"
          placeholder="WETH"
          data={[
            { value: "Custom", label: "Custom" },
            { value: "THERAS", label: "Theras-CHIP" },
            { value: "WETH", label: "WETH" },
            { value: "USDT", label: "USDT" },
            { value: "silver", label: "DAI" },
            { value: "gold", label: "USDC" },
          ]}
        />
        <TextInput
          className="ml-2"
          disabled
          placeholder="0x..."
          label={"Token Address"}
        />
      </div>
      <div className="flex items-end mt-2">
        <TextInput className="mr-2 invisible" />
        <TextInput
          className=""
          disabled
          // disabled={!!select}
          // value={!!select ? select?.category_title : state?.category_title}
          // onChange={(e) => setState({ ...state, category_title: e.target.value })}
          placeholder="..."
          label={"My Balance " + "WETH"}
        />
      </div>
    </div>
  );
};

const FormSender = () => {
  return (
    <>
      <TextInput
        // disabled={!!select}
        // value={!!select ? select?.category_title : state?.category_title}
        // onChange={(e) => setState({ ...state, category_title: e.target.value })}
        placeholder="Fans No.1"
        label="Send As"
        withAsterisk
      />
      <br />
      <Textarea
        // disabled={!!select}
        // value={!!select ? select?.category_title : state?.category_title}
        // onChange={(e) => setState({ ...state, category_title: e.target.value })}
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
