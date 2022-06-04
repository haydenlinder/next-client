import type { GetServerSideProps, NextPage } from "next";
import {
  GetUserByEmailQuery,
} from "../types/generated/graphql";
import { getUsers } from "./api/apollo_functions/users";

export const getServerSideProps: GetServerSideProps<{
  data: GetUserByEmailQuery | null;
}> = async ({ req, res }) => {

  return {
    props: await getUsers(),
  };

};

const Home: NextPage<{ data: GetUserByEmailQuery }> = ({ data }) => {

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
