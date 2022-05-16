import type { GetServerSideProps, NextPage } from "next";
import { GET_USER_BY_EMAIL } from "../graphql/users";
import client from "./api/apollo-client";
import {
  GetUserByEmailQuery,
  GetUserByEmailQueryVariables,
} from "../types/generated/graphql";

export const getServerSideProps: GetServerSideProps<{
  data: GetUserByEmailQuery;
}> = async ({ req, res }) => {
  const { data } = await client.query<
    GetUserByEmailQuery,
    GetUserByEmailQueryVariables
  >({ query: GET_USER_BY_EMAIL, variables: { _eq: "test@test.com" } });

  return {
    props: { data },
  };

};

const Home: NextPage<{ data: GetUserByEmailQuery }> = ({ data }) => {
  const user = data.users_connection.edges[0].node;

  return (
    <section>
      <h1>username: {user.username}</h1>
      <div>email: {user.email}</div>
      <div>joined: {user.created_at}</div>
    </section>
  );
};

export default Home;
