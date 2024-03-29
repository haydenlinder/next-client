import { ApolloClient, InMemoryCache, from, HttpLink, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

export const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_URL
})

export const errorLink = onError((e) => {
  const { graphQLErrors, networkError } = e;
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

export const authLink = (token: string) => new ApolloLink((operation, forward) => {
  operation.setContext({ headers: { authorization: `Bearer ${token}` } });
  return forward(operation);
});

const adminLink = new ApolloLink((operation, forward) => {
  operation.setContext({ headers: { "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET || "" } });
  return forward(operation);
});

export const serverClient = new ApolloClient({
  cache: new InMemoryCache({
    resultCaching: false
  }),
  link: from([errorLink, adminLink, httpLink]),
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, authLink(''), httpLink])
});

export default client;
