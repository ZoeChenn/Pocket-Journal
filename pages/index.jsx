import React from "react";
import Navbar from "../layouts/Navbar";
import LoginSection from "../layouts/LoginSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="relative py-52 ">
        <div className="absolute inset-1 bg-[url('/assets/images/bg-cover.jpg')] bg-center bg-no-repeat opacity-20"></div>
        <div className="relative grid items-center p-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-5 mt-2 font-bold text-center">Your tasks, notes, and calendar.</h2>
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-5 mt-2 font-bold text-center">All linked in one place.</h2>
          <h3 className="text-lg font-light  mt-5 text-center">Let's get started!</h3>
          <div className="flex justify-center mt-10">
            <LoginSection />
          </div>
        </div>
      </main>
      <footer className="mt-20 w-full border-t border-solid border-stone-100">
        <div className="px-4 lg:px-40 py-4 flex justify-between items-center">
          <p>© 2023 ZoeChen</p>
          <div className="flex flex-row">
            <a href="https://github.com/ZoeChenn">
              <img className="w-8 cursor-pointer" src="/assets/images/icons/github-icon.svg" alt="GitHub" />
            </a>
            <a href="https://linkedin.com/in/zoechennn">
              <img className="w-8 ml-4 cursor-pointer" src="/assets/images/icons/linkedin-icon.svg" alt="LinkedIn" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

