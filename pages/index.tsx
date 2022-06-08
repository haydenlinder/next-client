import type { GetServerSideProps, NextPage } from "next";
import {
  GetUsersPaginatedQuery,
} from "../types/generated/graphql";
import { ApolloQueryResult } from "@apollo/client";
import { getUsers } from "./api/apollo_functions/users";
type Props = ApolloQueryResult<GetUsersPaginatedQuery>
export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {

  return {
    props: await getUsers(),
  };

};

const Home: NextPage<Props> = ({ data }) => {
  if (!data) return <div>no data</div>

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
