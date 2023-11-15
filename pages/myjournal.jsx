import React, { useState, useEffect } from "react";
import { UserAuth } from "../lib/AuthContext";
import { FiLogOut, FiPlus, FiPlusCircle, FiFileText } from 'react-icons/fi';
import Calendar from "../components/Calendar/Calendar";
import Note from "../components/Note/Note";
import Spinner from "../layouts/Spinner";

export default function MyJournalPage() {
  const { user, logOut } = UserAuth();
  const [ displayName, setDisplayName ] = useState("");
  const [ photoURL, setPhotoURL ] = useState("");
  // const [ loading, setLoading ] = useState(true);
  const [ notes, setNotes ] = useState([]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setPhotoURL(user.photoURL);
    }
  }, [user]);

  const handleSignOut = () => {
    try {
      logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNote = () => {
    const newNote = {
      id: Date.now(),
      title: "Untitled",
    };
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = notes.filter((note, i) => i !== index);
    setNotes(updatedNotes);
  };


  return (
    <main className="flex h-screen bg-white ">
      <aside className="w-60 p-4 bg-stone-50 hover:bg-stone-100">
        <div className="flex justify-between">
        <div className="flex mb-2 items-center">
          <img
            src={ photoURL }
            alt="Profile Pic"
            className="w-10 h-10 rounded-full mr-2"
          />
          <span className="font-bold">{ displayName }, welcome</span>
        </div>
        <div className="flex mb-2 items-center cursor-pointer">
          <FiLogOut onClick={ handleSignOut } />
        </div>
        </div>
        <div className="mt-5">
          <div className="flex justify-between mb-2 items-center">
            <p className="text-sm text-gray-600">我的專案</p>
            <FiPlus className="cursor-pointer" />
          </div>
          <div className="projectWrapper flex items-center">
          <FiFileText className="mr-1 " /> projects ...
          </div>
        </div>
      </aside>
      <section className="flex-grow p-8 overflow-y-auto">
        <div className="flex justify-between mb-2 items-center">
          <div className="flex">
            <p className="text-2xl font-light mr-2">我的專案</p>
            <p className="text-2xl font-medium">projectName</p>
          </div>
          <div>
            <FiPlusCircle className="w-7 h-7 cursor-pointer text-orange-400 " onClick={ handleAddNote } />
          </div>
        </div>
        <div className="noteWrapper">
          { notes.map (( note, index ) => (
            <Note
              key={ note.id }
              index={ index }
              onDelete={ handleDeleteNote }
              title={ note.title }
              content={ note.content }
            />
          ))}
        </div>
      </section>
      <section className="flex flex-col w-1/7 p-5 border-l border-gray">
        <Calendar />
        <div className="flex-grow overflow-y-auto">
          <h2 className="text-lg font-bold my-4">Tasks</h2>
        </div>
      </section>
    </main>
  );
}