import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache, defaultDataIdFromObject } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const Link = createHttpLink({
  uri: `${process.env.REACT_APP_SERVER_HOST}/graphql`,
  fetchOptions: {
    credentials:
      process.env.NODE_ENV === "production" ? "same-origin" : "include"
  }
});

const link = ApolloLink.from([errorLink, Link]);

const cache = new InMemoryCache({
  dataIdFromObject: object => {
    switch (object.__typename) {
      default:
        return object.id || defaultDataIdFromObject(object); // fall back to default handling
    }
  }
});

const client = new ApolloClient({
  connectToDevTools: process.env.NODE_ENV === "development",
  link,
  cache
});

export default client;
