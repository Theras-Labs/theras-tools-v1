// import { NotificationsProvider } from "@mantine/notifications";
import "../styles/global.css";
import type { CustomAppPage, AppProps } from "next/app";
import { AppMantineProvider, GlobalStyleProvider } from "src/lib/mantine";
import { SessionProvider, getSession } from "next-auth/react";
// import { AuthProvider } from "src/context/auth-context";
// import type { GetServerSideProps } from "next";
// import { parseCookies } from "nookies";
// import { useUserDataStore } from "../store/useUserDetail";
import {
  WagmiConfig,
  Chain,
  createClient,
  configureChains,
  mainnet,
  goerli,
} from "wagmi";
// import { getDefaultProvider } from "ethers";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { Notifications } from "@mantine/notifications";
// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [
    // mainnet,
    goerli,
  ],
  [
    alchemyProvider({ apiKey: "6yf3YDnDZiMPDDhfTcGfDjouw1AIgGEG" }),
    publicProvider(),
  ]
);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    // todo refactor and split
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "...",
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

const MyApp: CustomAppPage = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <GlobalStyleProvider>
      <WagmiConfig client={client}>
        <SessionProvider session={session}>
          <AppMantineProvider>
            <Component {...pageProps} />
            <Notifications />
          </AppMantineProvider>
        </SessionProvider>
      </WagmiConfig>
    </GlobalStyleProvider>
  );
};

// MyApp.getInitialProps = async (ctx: any) => {
// //   // Retrieve the cookie value from the request headers
// //   const cookies = parseCookies(ctx);
// //   const email = cookies["next-auth.session-token"];
// //   console.log(email, "COOKIES SERVERSIDE");

// //   // Load the user data using the email value
// //   const userDataStore = useUserDataStore.getState() as any;
// //   await userDataStore.loadUserData(email);

// //   // Pass the user data to the page props
// //   return { props: { userData: userDataStore.userData } };
// // };

//   // perhaps getSession(appContext.ctx) would also work
//   const session = await getSession({ req: appContext.ctx.req })
//   const appProps = await App.getInitialProps(appContext)
//   return { ...appProps, session }
// }
export default MyApp;
