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
          user_id
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
          id
          user_id
          username
          password_hash
        }
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
query getUserById($_eq: Int = 0) {
  users_connection(where: {user_id: {_eq: $_eq}}) {
    edges {
      node {
        email
        id
        user_id
        created_at
        updated_at
        username
      }
    }
  }
}`;

export const CREATE_USER = gql`
mutation createUser($email: String = "", $password_hash: String = "", $username: String = "") {
  insert_users_one(object: {email: $email, password_hash: $password_hash, username: $username}) {
    id
    user_id
    email
    created_at
    updated_at
    username
  }
}`
