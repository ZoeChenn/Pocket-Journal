import { useContext, createContext, useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [ user, setUser ] = useState(null);
  const router = useRouter();

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result) {
        router.push("/myjournal");
      }
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {

        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
    
        if (!docSnap.exists()) {
          await setDoc(userRef, {
          displayName: currentUser.displayName,
          email: currentUser.email
        });
        }
    
        setUser(currentUser);
      } else {
        setUser(null);
        // router.push("/");
        if (router.pathname !== "/privacyPolicy") {
          router.push("/");
        }
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

