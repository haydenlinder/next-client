import type { AppContext, AppInitialProps, AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import { ApolloProvider, from } from "@apollo/client";

import client, { authLink, errorLink, httpLink } from "./api/apollo-client";
import { Header, logout } from "../components/Header";

import "../styles/build.css";
import App from "next/app";


import { TokenPayload } from "./api/session/types";
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Ship Code</title>
        <meta name="description" content="Learn to code online" />
        <link rel="icon" href="/favicon.ico" />
      </Head> 
      <Main {...{Component, pageProps}}/>
    </ApolloProvider>
  );
}

const Main = ({ Component, pageProps }: Pick<AppProps, 'Component' | 'pageProps'>) => {
  client.setLink(from([errorLink, authLink(pageProps.accessToken), httpLink]))
  const [token] = useState(pageProps.accessToken)
  const [user] = useState<TokenPayload>(pageProps.user)

  return (
    <div id='app-scroll-container' className="flex flex-col items-center h-screen max-h-screen overflow-y-scroll bg-gradient-to-r from-blue-300 to-purple-300">
      <Header user={user} accessToken={token}/>
      <Component {...pageProps} />
    </div>
  )
}

const redirect = (res: AppContext['ctx']['res'], location: string) => {
  if (res) { // server
    res.writeHead(302, {
      Location: location
    }).end();

  } else { // client
    Router.push(location)
  }
}

export const sessionConditionRedirect = async (context: AppContext): Promise<AppInitialProps> => {
  // these will be available on the server
  const { req, res } = context.ctx;
  
  const path = (req?.url || context.ctx.pathname).split('?')[0] || '';
  
  const isAdminRoute = (path === '/admin');
  const isLoginRoute = (path === '/login');
  const isHomeRoute = (path === '/');
  
  const cookies = cookie.parse(req?.headers.cookie || '');
  const appProps = await App.getInitialProps(context)
  if (typeof window !== 'undefined') return appProps;

  console.log({cookies})

  let user: TokenPayload | undefined;
  const accessToken = cookies.access_token
  try {
    user = jwt.verify(accessToken, process.env.ACCESS_SECRET!) as TokenPayload;
  } catch (e) {
    console.error("auth error: ", e)
  }
  // logged out and requests '/admin'
  if (!user && isAdminRoute) {
    redirect(res, '/login')
    return appProps
  }
  // logged in and requests '/login' or requests '/admin' without being an admin user
  else if (accessToken && (isLoginRoute || isHomeRoute || (isAdminRoute && !user?.is_admin))) {
    redirect(res, '/courses')
    return appProps
  }
  // they are in the right place
  else return {
    pageProps: {
      accessToken,
      user
    },
  }

}

MyApp.getInitialProps = sessionConditionRedirect;

export default MyApp;
