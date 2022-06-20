import type { NextPage } from "next";
import {
  GetUsersPaginatedQuery, GetUsersPaginatedQueryResult,
} from "../types/generated/graphql";
import { useQuery } from "@apollo/client";
import { GET_USERS } from "../graphql/users";
import { useState } from "react";

const Home: NextPage = ({ }) => {
  const [body, setBody] = useState("");

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
      <form >
        <h1>Make an entry</h1>
        <label htmlFor="body">Body</label>
        <textarea className="border border-black rounded" onChange={e => setBody(e.target.value)} value={body} name="body" id="body" cols={30} rows={10}/>
      </form>
    </section>
  );
};

export default Home;
