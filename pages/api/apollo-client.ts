import { ApolloClient, InMemoryCache } from "@apollo/client";

const secret = process.env.HASURA_ADMIN_SECRET || ""
const uri = process.env.HASURA_URL

const client = new ApolloClient({
  uri,
  cache: new InMemoryCache(),
  headers: { "x-hasura-admin-secret": secret },
});

export default client;