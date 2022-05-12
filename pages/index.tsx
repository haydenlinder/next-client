import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <header className="p-4 bg-black text-white mb-3 absolute w-full top-0">
        <nav className="container">
          Header
        </nav>
      </header>
      <main className="max-h-screen min-h-screen flex justify-center overflow-y-scroll pt-28 pb-96">
        <div className="container h-screen flex flex-col items-center">
          <form className="flex flex-col items-center">
            <h1>Login</h1>
            <input className="border border-solid" placeholder="email" type="email"/>
            <input className="border border-solid" placeholder="password" type="password"/>
          </form>
        </div>
      </main>
    </>
  );
};

export default Home;
