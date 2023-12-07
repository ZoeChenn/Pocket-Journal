import { useEffect } from "react";
import '../public/styles/globals.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AuthContextProvider } from "../lib/AuthContext";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
    });
  }, []);
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default MyApp;
