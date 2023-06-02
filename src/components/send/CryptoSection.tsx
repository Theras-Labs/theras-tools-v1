import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";
import {
  Blockquote,
  Button,
  Code,
  Container,
  Divider,
  Modal,
  Select,
  Skeleton,
  TextInput,
  Textarea,
} from "@mantine/core";
import { Tabs } from "@mantine/core";
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
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";

import { InjectedConnector } from "wagmi/connectors/injected";
// import { Profile } from "src/component/SignInButton";
import {
  MetaMaskLogo,
  WalletConnectLogo,
  CoinbaseLogo,
} from "src/components/WalletProviderLogos";

const WalletButton = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  const { data: ensAvatar } = useEnsAvatar({ address });
  const { data: ensName } = useEnsName({ address });

  const { disconnect } = useDisconnect();
  return (
    <>
      <Modal opened={opened} onClose={close} title="Connect Your Wallet">
        {connectors.map((connector) => (
          <Button
            className="bg-green-600"
            fullWidth
            mt="xl"
            // disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            <span
              style={{
                marginRight:
                  connector.name == "MetaMask" ||
                  "Coinbase Wallet" ||
                  "WalletConnect"
                    ? "20px"
                    : "",
              }}
            >
              {connector.name}
            </span>
            {!connector.ready && " (unsupported)"}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              " (connecting)"}
            {(connector.name === "MetaMask" && (
              <MetaMaskLogo imgHeight={25} imgWidth={25} />
            )) ||
              (connector.name === "Coinbase Wallet" && (
                <CoinbaseLogo imgHeight={25} imgWidth={25} />
              )) ||
              (connector.name === "WalletConnect" && (
                <WalletConnectLogo imgHeight={25} imgWidth={25} />
              ))}
          </Button>
        ))}
      </Modal>
      <Button onClick={open} className="bg-orange-600">
        Connect Wallet
      </Button>
    </>
  );
};

const CryptoSection = ({ setState, state }) => {
  // ask to connect wallet
  const { address, isConnected } = useAccount();
  //   NETWORK
  const { data, isError, isLoading } = useBalance({
    address,
  });

  if (!address && !isConnected) {
    return (
      <div>
        <WalletButton />
        {/* Modal content */}
      </div>
    );
  }
  //   console.log(data, "data");

  return (
    <div className="">
      <Code>The amount will be auto convert to wei then usd</Code>
      <br />
      <br />
      <div className="flex items-end ">
        <TextInput
          disabled={isLoading && !isError}
          // value={!!select ? select?.category_title : state?.category_title}
          onChange={(e) => {
            const amount = e.target.value;
            if (+amount > Number(data?.formatted))
              return alert("Out of balance");
            setState({ ...state, value: e.target.value });
          }}
          placeholder="Amount"
          label="Send TFUEL"
        />
        <div className="ml-6">
          Balance: &nbsp;{" "}
          <span className="text-green-500">
            {isLoading ? "loading..." : Number(data?.formatted).toFixed(5)}
          </span>
        </div>
        {/* <Button className="bg-red-600 ml-2">Send</Button> */}
      </div>
      <br />
      or
      <br />
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
          defaultValue="fUSD"
          //   placeholder="fUSD"
          data={[
            ...TESTNET_NETWORKS[0]?.tokens.map((item) => ({
              value: item?.address,
              label: item?.name,
            })),
            { value: "0xCOMING_SOON", label: "Theras-CHIP" },
            { value: "CUSTOM", label: "CUSTOM" },
          ]}
          onChange={(e) => {
            // console.log(e, "e coin");
            setState({
              ...state,
              erc20_address: e === "CUSTOM" ? null : e,
              custom: e === "CUSTOM" ? true : false,
            });
            // setState({
            //   ...state,
            //   //   erc20_address: e === "CUSTOM" ? null : e,
            //   custom: e === "CUSTOM" ? true : false,
            // });
          }}
        />
        <TextInput
          className="ml-2"
          disabled={!state?.custom}
          //   placeholder={}
          defaultValue={TESTNET_NETWORKS[0]?.tokens[0]?.address}
          value={state?.custom ? null : state?.erc20_address}
          onChange={(e) => {
            if (state?.custom) {
              setState({ ...state, erc20_address: e.target.value });
            }
          }}
          label={"Token Address"}
        />
      </div>
      <div className="flex items-end mt-2">
        <TextInput className="mr-2 invisible" />
        <TextInput
          className=""
          disabled
          //   value={getBalanceERC20(state?.erc20)address}
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

export default CryptoSection;

// https://eth-rpc-api.thetatoken.org/rpc
const MAINNET_NETWORKS = [
  {
    chain_id: 1,
    network_name: "Ethereum",
    currency: "ETH",
    tokens: [
      { name: "USDT", address: "0xdac17f958d2ee523a2206206994597c13d831ec7" },
      { name: "USDC", address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" },
      { name: "DAI", address: "0x6b175474e89094c44da98b954eedeac495271d0f" },
    ],
  },
  {
    chain_id: 361,
    network_name: "Theta",
    currency: "TFUEL",
    tokens: [],
  },
];
const TESTNET_NETWORKS = [
  {
    chain_id: 5,
    network_name: "Goerli",
    tokens: [
      { name: "fUSD", address: "0xc94dd466416A7dFE166aB2cF916D3875C049EBB7" },
      { name: "ETHx", address: "0x5943F705aBb6834Cad767e6E4bB258Bc48D9C947" },
      { name: "fDAI", address: "0x88271d333C72e51516B67f5567c728E702b3eeE8" },
    ],
  },
];
