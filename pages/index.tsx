import type { NextPage } from "next";
import { H1 } from "../components/H1";
import { ButtonLink } from "../components/Button";
import Link from "next/link";
import { H2 } from "../components/H2";
import Head from "next/head";
import { Organization, WithContext } from 'schema-dts'

const jsonLd: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "World Code Camp",
  "description": "Learn to code online. Our coding classes will teach you the fundamentals of programming and software without the pricetag of a traditional bootcamp.",
  "url": "https://www.worldcodecamp.com",
  "logo": "https://www.worldcodecamp.com/favicon.ico"
} 

const Home: NextPage= () => {

  return (
    <>
      <Head>
        <title>World Code Camp</title>
        <meta
          name="description"
          content="Don't just learn to code, learn to ship it. Deploy your first website in the third course." 
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
      </Head>
      <main className="w-full">
        <section className="drop-shadow-lg z-10 h-screen pt-28 w-full flex flex-col items-center">
          <div className="container flex flex-col items-center">
            <H1 className="text-center my-4 mb-6">Don{"'"}t Just Learn to Code</H1>
            <H1 className="text-center my-4 mb-6">Learn to Ship it 🚢</H1>
            <H2 className="text-center my-10">
              Deploy your first website from scratch in the third course.
            </H2>
            <Link passHref href="/courses">
              <ButtonLink secondary className="text-lg lg:text-2xl mb-4 w-72">View Courses</ButtonLink>
            </Link>
          </div>
        </section>
        <section className="text-center bg-white pt-16 h-screen w-full flex flex-col items-center">
          <div className="container flex h-full flex-col items-center text-transparent bg-clip-text bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 ">
            <H1 className="my-2">Learn to Code</H1>
            <H1 className=" my-2">Without the BS</H1>
            <div className="my-4 flex flex-col items-center">
              <H2 className="mb-4">
                No outdated tech or useless exercises.
              </H2>
              <p className="mb-4 font-bold">
                Learn only what you need to land the job and succeed in the workplace.
              </p>
              <H2 className="mb-4">
                No boilerplate code or in-browser editors. 
              </H2>
              <p className="mb-4 font-bold">
                You create all the projects from scratch on your own machine,{" "}
                <br className="hidden sm:block" />
                which helps you learn better than hand-holding.
              </p>
              <Link passHref href="/courses">
                <ButtonLink 
                  className="text-lg mt-4 lg:text-2xl" 
                  secondary 
                  >
                  Get Started
                </ButtonLink>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
