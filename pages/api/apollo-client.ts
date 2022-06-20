import { ApolloClient, InMemoryCache, from, HttpLink, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { accessTokenState } from "../../token";

export const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_URL
})

export const errorLink = onError((e) => {
  const { graphQLErrors, networkError } = e;
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const authLink = new ApolloLink((operation, forward) => {
  accessTokenState() && operation.setContext({ headers: { authorization: `Bearer ${accessTokenState()}` } });
  return forward(operation);
});

export const serverClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, httpLink])
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, authLink, httpLink])
});

export default client;
