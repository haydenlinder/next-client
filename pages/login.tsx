import { useReactiveVar } from "@apollo/client";
import type { NextPage } from "next";
import Router from "next/router";
import React, { FormEventHandler, useState } from "react";
import { Button } from "../components/Button";
import { H1 } from "../components/H1";
import { Input } from "../components/Input";
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
    Router.replace('/courses')
  };
  
  return (
    <div className="w-full h-screen flex flex-col items-center ">

      <div className="w-96">
      <form onSubmit={isNewUser ? signup : login} className="flex flex-col items-center pt-32">
        <p className="h-4 m-4 font-bold text-red-600">{error}</p>
          <H1 className="mb-6">{isNewUser ? 'Hop on Board 🚢' : `Get back to Coding`}</H1>
        <Input
          required
          className="border border-solid rounded mb-4"
          placeholder="email"
          type="email"
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          required
          className="border border-solid rounded"
          placeholder="password"
          type="password"
          onChange={e => setPassword(e.target.value)}
        />
        <Button className="my-4">
          {isNewUser ? "Sign up" : "Log In"}
        </Button>
      </form>
        <Button 
          secondary
          onClick={() => setIsNewUser(bool => !bool) }
        >
          Switch to {isNewUser ? `Login` : `Signup`}
        </Button>
    </div>
    </div>
  );
};

export default Login;
