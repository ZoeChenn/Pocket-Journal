import { useContext, createContext, useState, useEffect } from "react";
import { signInWithRedirect, getRedirectResult, signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [ user, setUser ] = useState(null);
  const router = useRouter();

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // await signInWithPopup(auth, provider);
      await signInWithRedirect(auth, provider);
    } catch (error) {
      if (error.code === 'auth/cancelled-popup-request') {
        console.log('使用者取消登入');
      } else {
        console.error(error);
      }
    }
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push("/myjournal");
      } else {
        setUser(null);
        router.push("/");
      }
    });
  
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
      { children }
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};

