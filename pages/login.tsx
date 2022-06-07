import type { NextPage } from "next";
import React, { FormEventHandler, useState } from "react";
import { setToken } from "./api/token";

const Home: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isNewUser, setIsNewUser] = useState(true);

  const signup: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/session/signup", { method: "POST", body: JSON.stringify({ email, password }) });
    const data = await response.json();
  };

  const login: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/session/login", { method: "POST", body: JSON.stringify({ email, password }) });
    const data = await response.json();
    setToken(data.access_token)
  };
  
  return (
    <>
    <form onSubmit={isNewUser ? signup : login} className="flex flex-col items-center pb-10">
      <h1>{isNewUser ? `Sign Up`: `Login`}</h1>
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
      <button className="border border-solid rounded px-4 py-2">
        🚀
      </button>
    </form>
      <button
        className="border border-solid rounded px-4 py-2" 
        onClick={() => setIsNewUser(bool => !bool) }
      >
        Switch to {isNewUser ? `Login` : `Signup`}
      </button>
    </>
  );
};

export default Home;
