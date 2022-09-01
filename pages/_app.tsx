import type { AppContext, AppInitialProps, AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import { ApolloProvider, from } from "@apollo/client";

import client, { authLink, errorLink, httpLink, serverClient } from "./api/apollo-client";
import { Header } from "../components/Header";

import "../styles/build.css";
import App from "next/app";
import { GetUserByIdQuery, GetUserByIdQueryVariables } from "../types/generated/graphql";
import { GET_USER_BY_ID } from "../graphql/users";
import { refresh } from "./api/next-client";


function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head> 
      <Main {...{Component, pageProps}}/>
    </ApolloProvider>
  );
}

const Main = ({ Component, pageProps }: Pick<AppProps, 'Component' | 'pageProps'>) => {
  client.setLink(from([errorLink, authLink(pageProps.accessToken), httpLink]))

  return (
    <div id='app-scroll-container' className="flex flex-col items-center h-screen max-h-screen overflow-y-scroll">
      <Header user={pageProps.user} accessToken={pageProps.accessToken}/>
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

  const response = await refresh(req?.headers.cookie);
  const accessToken = response?.data?.access_token;
  const user_id = response?.data?.user_id;

  let user: GetUserByIdQuery['users_connection']['edges'][0]['node'] | undefined
  if (accessToken) {
    const { data } = await serverClient.query<GetUserByIdQuery, GetUserByIdQueryVariables>({
      query: GET_USER_BY_ID, 
      variables: {
        _eq: user_id
      },
      context: { headers: { authorization: `Bearer ${accessToken}` } }
    });
    user = data.users_connection.edges[0].node
  }

  const appProps = await App.getInitialProps(context)
  // logged out and requests '/admin'
  if (!accessToken && isAdminRoute) {
    redirect(res, '/login')
    return appProps
  }
  // logged in and requests '/login' or requests '/admin' without being an admin user
  else if (accessToken && (isLoginRoute || (isAdminRoute && !user?.is_admin))) {
    redirect(res, '/')
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
