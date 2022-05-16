import type { NextPage } from "next";
import { FormEventHandler } from "react";

const Home: NextPage = () => {
  const signup: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/auth/signup");
    const data = await response.json();
    console.log({ data });
  };

  return (
    <form onSubmit={signup} className="flex flex-col items-center">
      <h1>Login</h1>
      <input
        className="border border-solid rounded"
        placeholder="email"
        type="email"
      />
      <input
        className="border border-solid rounded"
        placeholder="password"
        type="password"
      />
      <button className="border border-solid rounded">Signup</button>
    </form>
  );
};

export default Home;
