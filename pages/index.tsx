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

const Home: NextPage= () => {
  return (
    <main className="w-full">
      <section className="text-white drop-shadow-md h-screen pt-36 bg-gradient-to-r from-green-400 to-blue-500 w-full flex flex-col items-center">
        <div className="container flex flex-col items-center">
          <H1 className="text-center my-4 mb-6">Don{"'"}t Just Learn to Code</H1>
          <H1 className="text-center my-4 mb-6">Learn to Ship it 🚢</H1>
          <H2 className="text-center my-10">
            Deploy your first website from scratch in the third course.
          </H2>
          <Link passHref href='/courses'>
            <Button className="bg-white mb-4">View Courses</Button>
          </Link>
          <Button className="bg-white" onClick={e => document.getElementById('app-scroll-container')?.scroll({ top: window.innerHeight, behavior: 'smooth' })}>Learn Why We{"'"}re Different</Button>
        </div>
      </section>
      <section className="text-white text-center pt-16 h-screen w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center">
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
              You create all the projects from scratch on your own machine, 
              <br />
              which helps you learn better than hand-holding.
            </p>
          </div>
          <Link passHref href='/courses'>
            <Button className="bg-white">View Courses</Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
