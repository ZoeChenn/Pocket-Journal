import React from "react";

const Navbar = () => {

  return (
    <nav className="fadeIn flex w-full px-8 lg:px-20 py-3 border-b border-solid border-stone-100">
      <div className="flex items-center">
        <img src="./pocketJournal-icon.png" alt="Pocket Journal" className="h-10 w-10 mr-2" />
        <h1 className="text-2xl	font-bold">Pocket Journal</h1>
      </div>
    </nav>
  );
};

export default Navbar;
