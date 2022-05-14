import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.LOCAL_HASURA_URL,
  cache: new InMemoryCache(),
  headers: { "x-hasura-admin-secret": "1234" },
});

export default client;
