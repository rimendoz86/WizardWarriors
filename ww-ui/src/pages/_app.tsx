import { SocketProvider } from "@contexts/Socket";
import { Provider } from "jotai";
import type { AppProps } from "next/app";
import Head from "next/head";
import { getStore } from "src/state";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={getStore()}>
      <SocketProvider>
        <Head>
          <title>Wizard Warriors Game</title>
          <meta lang="en" />
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </SocketProvider>
    </Provider>
  );
}

export default MyApp;
