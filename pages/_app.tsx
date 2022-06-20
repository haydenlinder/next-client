import type { AppProps } from "next/app";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import { ApolloProvider, from, useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";

import { accessTokenState, currentUserIdState } from "../token";
import client, { authLink, errorLink, httpLink } from "./api/apollo-client";
import { Header } from "../components/Header";

import "../styles/build.css";
import { RefreshResponse } from "./api/session/refresh";

const baseUrl = typeof window === 'undefined' ? "" : window.location.origin

function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>      
      <Main {...{Component, pageProps}}/>
    </ApolloProvider>
  );
}

const Main = ({ Component, pageProps }: Pick<AppProps, 'Component' | 'pageProps'>) => {
    const [loading, setLoading] = useState(true);
    const accessToken = useReactiveVar(accessTokenState);
    const {asPath} = useRouter();

    useEffect(() => {
      if (accessToken) return;
      setLoading(true);
      // see if we can get a new access token with our refresh token cookie
      (async () => {
        let access_token: string | undefined;
        try {
          const response = await refresh();
          access_token = response?.data?.access_token;
          const user_id = Number(response?.data?.user_id);
          accessTokenState(access_token);
          currentUserIdState(user_id);
        } catch (e) {
          console.log("REFRESH ERROR: ", { e })
        } finally {
          setLoading(false);
        }
        client.setLink(from([errorLink, authLink, httpLink]))
        if (!access_token) Router.replace('/login')
      })();
  }, [accessToken, asPath]);

  if (loading) return <div>loading</div>

  return (
    <main className="max-h-screen min-h-screen flex justify-center overflow-y-scroll pt-28 pb-96">
      <div className="container h-screen flex flex-col items-center">
        <Component {...pageProps} />
      </div>
    </main>
  )
}

const refresh = async () => {
  const response = await fetch(baseUrl + "/api/session/refresh");
  const data: RefreshResponse = await response.json();
  if (response.status !== 200) return undefined
  return data;
};

export default MyApp;
