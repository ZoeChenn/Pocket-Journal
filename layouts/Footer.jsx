import React from "react";

const Footer = () => {

  return (
    <footer className="mt-20 w-full border-t border-solid border-stone-100">
      <div className="px-4 lg:px-40 py-4 flex justify-between items-center">
        <p className="cursor-default">© 2023 ZoeChen</p>
        <div className="flex flex-row items-center">
          <a href="/privacyPolicy" className="cursor-pointer mr-6 hover:text-stone-500" >
            Privacy Policy
          </a>
          <a href="https://github.com/ZoeChenn">
            <img className="w-8 cursor-pointer" src="/assets/images/icons/github-icon.svg" alt="GitHub" />
          </a>
          <a href="https://linkedin.com/in/zoechennn">
            <img className="w-8 ml-4 cursor-pointer" src="/assets/images/icons/linkedin-icon.svg" alt="LinkedIn" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
