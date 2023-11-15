import '../public/styles/globals.css';
// import "../public/styles/editor.css"
import { AuthContextProvider } from "../lib/AuthContext";

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default MyApp;
