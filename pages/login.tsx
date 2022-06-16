import { useReactiveVar } from "@apollo/client";
import type { NextPage } from "next";
import Router from "next/router";
import React, { FormEventHandler, useState } from "react";
import { accessTokenState } from "../token";


const Home: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const accessToken = useReactiveVar(accessTokenState)
  console.log('login: ', {accessToken})
  const [isNewUser, setIsNewUser] = useState(true);
  const signup: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/session/signup", { method: "POST", body: JSON.stringify({ email, password }) });
      const data = await response.json();
    } catch (e) {
      console.log("SIGNUP ERROR: ", e)
    }
  };
  
  if (accessToken) Router.replace('/') 

  const login: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/session/login", { method: "POST", body: JSON.stringify({ email, password }) });
      const data = await response.json();
      accessTokenState(data.access_token)
    } catch (e) {
      console.log("LOGIN ERROR: ", e)
    }
    
    Router.replace('/')
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
