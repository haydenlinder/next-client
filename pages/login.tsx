
import type { NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import React, { useState } from "react";
import { H1 } from "../components/H1";
import LoginForm from "../components/LoginForm";

const Login: NextPage = () => {
  const [isNewUser] = useState(false);

  return (
    <>
      <Head>
        <title>Learn to Code | Login</title>
        <meta 
          name="description" 
          content="Log in and get back to coding."/>
      </Head>
      <div className="w-full h-screen flex flex-col items-center">
        <div className="w-96 pt-32">
          <LoginForm 
            onSuccess={() => Router.replace('/courses')}
            heading={isNewUser => <H1 className="mb-6 text-center">{isNewUser ? 'Hop on Board 🚢' : `Get back to Coding`}</H1>} 
          />
        </div>
      </div>
    </>
  );
};

export default Login;
