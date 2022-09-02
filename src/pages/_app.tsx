import type { AppProps } from "next/app";
import Head from "next/head";
import {
  connectorsForWallets,
  RainbowKitProvider,
  wallet,
} from "@rainbow-me/rainbowkit";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { createWebStoragePersister } from "react-query/createWebStoragePersister";
import { Toaster } from "react-hot-toast";

import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { CHAIN } from "../config";

const { chains, provider } = configureChains([CHAIN], [publicProvider()]);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      wallet.metaMask({ chains }),
      wallet.walletConnect({ chains }),
      wallet.coinbase({ chains, appName: "Popcult" }),
    ],
  },
]);

const client = createClient({
  autoConnect: true,
  provider,
  connectors,
  persister: createWebStoragePersister({
    key: "wagmi",
    storage: {
      getItem: () => null,
      removeItem: () => null,
      setItem: () => null,
    },
  }),
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>
        <Head>
          <title>PopCult NFT</title>
        </Head>
        <Component {...pageProps} />
        <Toaster />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default MyApp;
