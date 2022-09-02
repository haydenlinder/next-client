
import type { NextPage } from "next";
import Router from "next/router";
import React, { FormEventHandler, useState } from "react";
import { Button } from "../components/Button";
import { H1 } from "../components/H1";
import { Input } from "../components/Input";
import LoginForm from "../components/LoginForm";
import { RefreshResponse } from "./api/session/refresh";


const Login: NextPage = () => {
  const [isNewUser] = useState(false);

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <div className="w-96 pt-32">
        <LoginForm 
          heading={isNewUser => <H1 className="mb-6 text-center">{isNewUser ? 'Hop on Board 🚢' : `Get back to Coding`}</H1>} 
        />
    </div>
    </div>
  );
};

export default Login;
