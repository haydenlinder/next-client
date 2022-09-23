import type { AppContext, AppInitialProps, AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import { ApolloProvider, from } from "@apollo/client";

import client, { authLink, errorLink, httpLink } from "./api/apollo-client";
import { Header } from "../components/Header";

import "../styles/build.css";
import App from "next/app";
import cookie from 'cookie'
import { useEffect } from "react";
import { useStore } from "../state/store";
import { refresh } from "./api/next-client";
import { logout } from "./api/session_functions";
import Script from "next/script";
declare global {
  interface Window { 
    dataLayer: {
      push: (args: unknown) => []
    }; 
  }
}

const analytics = () => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  function gtag(lang: string, id: Date | string) { window.dataLayer.push(arguments); }
  gtag('js', new Date());

  gtag('config', 'G-4E4D0055ZT');
  return null
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>World Code Camp</title>
        <meta name="description" content="Learn to code online" />
        <link rel="icon" href="/favicon.ico" />
        {/* <!-- Google tag (gtag.js) --> */}
        {analytics()}
      </Head> 
      <div id='modal-container'></div>
      <Main {...{Component, pageProps}}/>
    </ApolloProvider>
  );
}

const Main = ({ Component, pageProps }: Pick<AppProps, 'Component' | 'pageProps'>) => {
  const { setAccessToken, setSession } = useStore((store) => store)
  
  useEffect(() => {
    refresh().then((r) => {
      setAccessToken(r?.data?.access_token)
      setSession(r?.data?.session)
      client.setLink(from([errorLink, authLink(r?.data?.access_token || ""), httpLink]))
    }).catch(() => logout({ setAccessToken, setSession }))
  }, [])

  return (
    <div id='app-scroll-container' className="flex flex-col items-center h-screen max-h-screen overflow-y-scroll bg-gradient-to-r from-blue-300 to-purple-300">
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-4E4D0055ZT"></Script>
      <Header />
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp;
