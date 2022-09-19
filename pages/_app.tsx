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
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-4E4D0055ZT"></Script>
        {analytics()}
      </Head> 
      <div id='modal-container'></div>
      <Main {...{Component, pageProps}}/>
    </ApolloProvider>
  );
}

const Main = ({ Component, pageProps }: Pick<AppProps, 'Component' | 'pageProps'>) => {
  const { setAccessToken, setSession } = useStore((store) => store)
  const accessToken = pageProps.accessToken
  useEffect(() => {
    refresh().then((r) => {
      setAccessToken(r?.data?.access_token)
      setSession(r?.data?.session)
      client.setLink(from([errorLink, authLink(r?.data?.access_token || ""), httpLink]))
    }).catch(() => logout({ setAccessToken, setSession }))
  }, [pageProps.accessToken])

  return (
    <div id='app-scroll-container' className="flex flex-col items-center h-screen max-h-screen overflow-y-scroll bg-gradient-to-r from-blue-300 to-purple-300">
      <Header />
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
};

MyApp.getInitialProps = async (context: AppContext): Promise<AppInitialProps> => {
  // these will be available on the server
  const { req, res } = context.ctx;

  const path = (req?.url || context.ctx.pathname).split('?')[0] || '';

  const isAdminRoute = (path === '/admin');
  const isLoginRoute = (path === '/login');
  const isHomeRoute = (path === '/');

  const cookies = cookie.parse(req?.headers.cookie || '');
  const accessToken = cookies.access_token

  const appProps = App.getInitialProps(context);

  if (typeof window !== 'undefined') return appProps

  // logged out and requests '/admin'
  if (!cookies.user_id && isAdminRoute) {
    redirect(res, '/login')
    return {
      pageProps: {
        user: undefined,
        accessToken: undefined
      }
    }
  }
  // logged in and requests '/login' or '/' or requests '/admin' without being an admin user
  else if (accessToken && (isLoginRoute || isHomeRoute || (isAdminRoute && (String(false) === cookies.is_admin)))) {
    redirect(res, '/courses')
    return appProps
  }
  // they are in the right place
  else return {
    pageProps: {
      accessToken,
    },
  }

}


export default MyApp;
