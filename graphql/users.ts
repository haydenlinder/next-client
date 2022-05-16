import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query getUsersPaginated($first: Int = 10) {
    users_connection(first: $first) {
      edges {
        cursor
        node {
          created_at
          email
          updated_at
          username
          id
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const GET_USER_BY_EMAIL = gql`
  query getUserByEmail($_eq: String = "") {
    users_connection(where: { email: { _eq: $_eq } }) {
      edges {
        node {
          created_at
          email
          updated_at
          username
        }
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
query getUserById($_eq: Int = 0) {
  users_connection(where: {id: {_eq: $_eq}}) {
    edges {
      node {
        email
        id
        created_at
        updated_at
        username
      }
    }
  }
}`
