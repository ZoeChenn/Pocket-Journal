import React from "react";
import Navbar from "../layouts/Navbar";
import LoginSection from "../layouts/LoginSection";

export default function HomePage() {
  return (<>
    <Navbar />
    <main className="h-screen">
      <div className="grid items-center p-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl mb-5 mt-2 font-bold text-center">Your tasks, notes, and calendar.</h2>
        <h2 className="text-3xl sm:text-4xl md:text-5xl mb-5 mt-2 font-bold text-center">All linked in one place.</h2>
        <h3 className="text-lg font-normal mt-5 text-center">Login and get started</h3>
        <div className="flex mx-auto mt-10 ">
          <LoginSection />
        </div>
      </div>
    </main>
    <footer className="mt-20 w-full border-t border-solid border-stone-100">
      <div className="px-4 lg:px-40 py-4 flex justify-between items-center">
        <p className="">© 2023 ZoeChen</p>
        <div className="flex flex-row">
          <a href="https://github.com/ZoeChenn">
            <img className="w-8 cursor-pointer" src="/assets/images/icons/github-icon.svg" alt="" />
          </a>
          <a href="https://linkedin.com/in/zoechennn">
            <img className="w-8 ml-4 cursor-pointer" src="/assets/images/icons/linkedin-icon.svg" alt="" />
          </a>
        </div>
      </div>
    </footer>
  </>
  );
}
