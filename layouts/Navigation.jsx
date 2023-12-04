import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { UserAuth } from "../lib/AuthContext";
import { FiLogOut } from 'react-icons/fi';

export const Navigation = () => {
  const router = useRouter();
  const { user, logOut } = UserAuth();
  const [ displayName, setDisplayName ] = useState("");
  const [ photoURL, setPhotoURL ] = useState("");
  // const [ loading, setLoading ] = useState(true);

  const handleSignOut = () => {
    try {
        logOut();
        router.push('/');
    } catch (error) {
        console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setPhotoURL(user.photoURL);
    }
  }, [user]);

  return (
    <>
      <aside className="p-4 bg-stone-50 hover:bg-stone-100">
        <div className="flex justify-between">
        <div className="flex mb-2 items-center">
          <img
            src={ photoURL }
            alt="Profile Pic"
            className="w-10 h-10 rounded-full mr-2"
          />
          <span>{ displayName }</span>
        </div>
        <div className="flex mb-2 items-center cursor-pointer">
          <FiLogOut onClick={ handleSignOut } />
        </div>
        </div>
        <div className="cursor-col-resize" onMouseDown={startDragging}>|||</div>
      </aside>
    </>
  );
};