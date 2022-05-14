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
