import type { NextPage } from "next";
import { FormEventHandler, useState } from "react";

const Home: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const signup: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/session/signup", { method: "POST", body: JSON.stringify({ email, password }) });
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
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="border border-solid rounded"
        placeholder="password"
        type="password"
        onChange={e => setPassword(e.target.value)}
      />
      <button className="border border-solid rounded">Signup</button>
    </form>
  );
};

export default Home;
