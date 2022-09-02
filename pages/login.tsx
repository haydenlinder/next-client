
import type { NextPage } from "next";
import Router from "next/router";
import React, { FormEventHandler, useState } from "react";
import { Button } from "../components/Button";
import { H1 } from "../components/H1";
import { Input } from "../components/Input";
import LoginForm from "../components/LoginForm";
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
    <div className="w-full h-screen flex flex-col items-center">

      <div className="w-96 pt-32">
          <H1 className="mb-6 text-center">{isNewUser ? 'Hop on Board 🚢' : `Get back to Coding`}</H1>
          <LoginForm isNewUser={isNewUser}/>
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
