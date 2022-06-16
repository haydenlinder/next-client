import type { NextPage } from "next";
import {
  GetUsersPaginatedQuery, GetUsersPaginatedQueryResult,
} from "../types/generated/graphql";
import { useQuery } from "@apollo/client";
import { GET_USERS } from "../graphql/users";

const Home: NextPage = ({ }) => {

  const { data, loading, error } = useQuery<
    GetUsersPaginatedQuery,
    GetUsersPaginatedQueryResult
  >(GET_USERS);

  if (loading) return <div>loading...</div>;
  if (error) {
    console.log({error})
    return <div>no data</div>
  };

  const user = data?.users_connection.edges[0].node;


  return (
    <section>
      <h1>username: {user?.username}</h1>
      <div>email: {user?.email}</div>
      <div>joined: {user?.created_at}</div>
    </section>
  );
};

export default Home;
