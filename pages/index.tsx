import type { NextPage } from "next";
import {
  GetPostsQuery,
} from "../types/generated/graphql";
import { GET_POSTS } from "../graphql/posts";
import { H1 } from "../components/H1";
import { useQuery } from "@apollo/client";
import { Button } from "../components/Button";
import Link from "next/link";
import { H2 } from "../components/H2";
import { Input } from "../components/Input";
import { useState } from "react";

const Home: NextPage= () => {
  const [email, setEmail] = useState('')

  return (
    <main className="w-full">
      <section className="text-white drop-shadow-md h-screen pt-28 bg-gradient-to-r from-green-500 to-blue-500 w-full flex flex-col items-center">
        <div className="container flex flex-col items-center">
          <H1 className="text-center my-4 mb-6">Don{"'"}t Just Learn to Code</H1>
          <H1 className="text-center my-4 mb-6">Learn to Ship it 🚢</H1>
          <H2 className="text-center my-10">
            Deploy your first website from scratch in the third course.
          </H2>
          <form className="flex flex-col items-center w-96">
            <Input value={email} onChange={e => setEmail(e.target.value)} id='email-input' type="email" placeholder="Email" className="mb-4 text-center text-black font-bold text-lg" required />
            <Button secondary className="text-lg lg:text-2xl mb-4 w-full">Get Started</Button>
          </form>
        </div>
      </section>
      <section className="text-white text-center pt-16 h-screen w-full bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col items-center">
        <div className="container flex flex-col items-center">
          <H1 className="my-4 mb-6">Learn to Code</H1>
          <H1 className=" my-4 mb-6">Without the BS</H1>
          <div className="my-10 flex flex-col items-center">
            <H2 className="mb-4">
              No outdated tech or useless exercises.
            </H2>
            <p className="mb-4">
              Learn only what you need to land the job and succeed in the workplace.
            </p>
            <H2 className="mb-4">
              No boilerplate code or in-browser editors. 
            </H2>
            <p>
              You create all the projects from scratch on your own machine,{" "}
              <br className="hidden sm:block" />
              which helps you learn better than hand-holding.
            </p>
          </div>
          <Button 
            className="text-lg lg:text-2xl" 
            secondary 
            onClick={e => {
              document.getElementById('app-scroll-container')?.scroll({ top: 0, behavior: 'smooth' })
              setTimeout(() => document.getElementById('email-input')?.focus(), 500)
            }}
          >
            Get Started
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Home;
