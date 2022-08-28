import { useReactiveVar } from "@apollo/client";
import type { NextPage } from "next";
import Router from "next/router";
import React, { FormEventHandler, useState } from "react";
import { Button } from "../components/Button";
import { RefreshResponse } from "./api/session/refresh";


const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<undefined | string>(undefined);


  const [isNewUser, setIsNewUser] = useState(false);

  const signup: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/session/signup", { method: "POST", body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (response.status !== 200) return setError(data.errors)
    } catch (e) {
      console.error("SIGNUP ERROR: ", e)
    }
  };

  const login: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/session/login", { method: "POST", body: JSON.stringify({ email, password }) });
      const data: RefreshResponse = await response.json();

      if (response.status !== 200) return setError(data.errors);
      
    } catch (e) {
      console.error("LOGIN ERROR: ", e)
    }
    Router.replace('/')
  };
  
  return (
    <>
    <form onSubmit={isNewUser ? signup : login} className="flex flex-col items-center pb-10">
      <p className="h-4 m-4 font-bold text-red-600">{error}</p>
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
      <Button className="my-2">
        🚀
      </Button>
    </form>
      <Button
        className="my-2" 
        onClick={() => setIsNewUser(bool => !bool) }
      >
        Switch to {isNewUser ? `Login` : `Signup`}
      </Button>
    </>
  );
};

export default Login;
