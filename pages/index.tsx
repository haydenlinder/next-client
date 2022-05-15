import type { GetServerSideProps, NextPage } from "next";
import { GET_USERS } from "../graphql/users";
import client from "./api/apollo-client";
import { GetUsersPaginatedQuery } from '../types/generated/graphql'

export const getServerSideProps: GetServerSideProps<{data: GetUsersPaginatedQuery}> = async ({ req, res }) => {
  const { data } = await client.query<GetUsersPaginatedQuery>({ query: GET_USERS });
  data.users_connection
  return {
    props: { data },
  };
};

const Home: NextPage<GetUsersPaginatedQuery> = ({ users_connection }) => {
  console.log({ users_connection });
  return (
    <>
      <header className="p-4 bg-black text-white mb-3 absolute w-full top-0">
        <nav className="container">Header</nav>
      </header>
      <main className="max-h-screen min-h-screen flex justify-center overflow-y-scroll pt-28 pb-96">
        <div className="container h-screen flex flex-col items-center">
          <form className="flex flex-col items-center">
            <h1>Login</h1>
            <input
              className="border border-solid"
              placeholder="email"
              type="email"
            />
            <input
              className="border border-solid"
              placeholder="password"
              type="password"
            />
          </form>
        </div>
      </main>
    </>
  );
};

export default Home;
