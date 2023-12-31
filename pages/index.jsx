import React from "react";
import Head from 'next/head';
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import LoginBtn from "../layouts/LoginBtn";
import { FiChevronsDown, FiChevronsUp } from "react-icons/fi";

export default function HomePage() {

  const scrollDown = () => {
    window.scrollTo({
      top: 740,
      behavior: 'smooth'
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <Head>
        <title>Pocket Journal</title>
      </Head>
      <Navbar />
      <section className="relative py-40 max-xl:py-36">
        <div className="absolute inset-1 bg-[url('/assets/images/bg-cover.jpg')] bg-center bg-no-repeat opacity-20"></div>
        <div className="relative grid items-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-5 mt-2 font-bold text-center cursor-default" data-aos="fade-in">Your tasks, notes, and calendar.</h2>
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-5 mt-2 font-bold text-center cursor-default" data-aos="fade-in">All linked in one place.</h2>
          <h3 className="text-lg font-normal mt-5 text-center cursor-default" data-aos="fade-up">Lets get started!</h3>
          <div className="flex justify-center mt-10" data-aos="fade-up">
            <LoginBtn />
          </div>
        </div>
        <div className="text-center mt-20 cursor-pointer" data-aos="fade-up" onClick={ scrollDown }>
          <span className="font-semibold text-xl"> SCROLL DOWN </span>
          <br />
          <FiChevronsDown className="mx-auto w-9 h-9 mt-5 animate-bounce" />
        </div>
      </section>
        <section className="mx-auto py-24 px-24 bg-white">
          <div className="mx-auto flex flex-wrap md:flex-row-reverse">
            <div className="w-full cursor-default md:w-2/6 md:pl-12" data-aos="fade-left">
              <h2 class="my-4 leading-tight text-2xl font-bold sm:text-3xl">Take Note in Project Mode</h2>
              <hr className="w-40" />
              <div class="text-xl font-light sm:leading-relaxed sm:text-2xl">
                <p>Make your notes and thoughts more organized.</p>
              </div>
            </div>
            <div className="w-full md:w-4/6 mt-12 sm:mt-0" data-aos="fade-right">
              <img src="/assets/images/howToUse1.gif" alt="" className="shadow-lg rounded-2xl" />
            </div>
          </div>
        </section>
        <section className="mx-auto py-24 px-24 bg-gray-100">
          <div className="mx-auto flex flex-wrap md:flex-row-reverse">
            <div className="w-full md:w-4/6 mt-12 sm:mt-0" data-aos="fade-left">
              <img src="/assets/images/howToUse2.gif" alt="" className="shadow-lg rounded-2xl" />
            </div>
            <div className="w-full cursor-default md:w-2/6 md:pl-12" data-aos="fade-right">
              <h2 class="my-4 leading-tight text-2xl font-bold sm:text-3xl">Smart Markdown Tasks</h2>
              <hr className="w-40 border-gray-300 " />
              <div class="text-xl font-light sm:leading-relaxed sm:text-2xl">
                <p>Use the flexibility of Markdown to quickly create tasks.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto py-24 px-24 bg-white">
          <div className="mx-auto flex flex-wrap md:flex-row-reverse">
            <div className="w-full cursor-default md:w-2/6 md:pl-12" data-aos="fade-left">
              <h2 class="my-4 leading-tight text-2xl font-bold sm:text-3xl">Take Notes. Date Notes.</h2>
              <hr />
              <div class="text-xl font-light sm:leading-relaxed sm:text-2xl">
                <p>Attach dates to individual notes.</p>
              </div>
            </div>
            <div className="w-full md:w-4/6 mt-12 sm:mt-0" data-aos="fade-right">
              <img src="/assets/images/howToUse3.gif" alt="" className="shadow-lg rounded-2xl" />
            </div>
          </div>
        </section>
        <div class="text-center mt-5 cursor-pointer" data-aos="fade-up" onClick={ scrollToTop }>
          <span className="font-semibold text-xl"> BACK TO TOP </span>
          <br />
          <FiChevronsUp className="mx-auto w-9 h-9 mt-5 animate-bounce" />
        </div>
      <Footer />
    </>
  );
}

