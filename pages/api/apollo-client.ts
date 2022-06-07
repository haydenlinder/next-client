import { ApolloClient, InMemoryCache, from, HttpLink, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import {getToken} from './token'

const httpLink = new HttpLink({
  uri: process.env.HASURA_URL
})

const errorLink = onError((e) => {
  const { graphQLErrors, networkError } = e;
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({ headers: { authorization: `Bearer ${getToken()}` } });
  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, authLink, httpLink])
  // headers: { "x-hasura-admin-secret": secret },
});

export default client;
