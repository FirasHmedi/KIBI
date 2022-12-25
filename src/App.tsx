import { Header } from "./components/Header";
import Home from "./pages/home/Home";
import { appStyle } from "./styles/Style";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDg52B5IZ4dHiqdkO3R5J1q3q-t3z_er8",
  authDomain: "kawa-58848.firebaseapp.com",
  projectId: "kawa-58848",
  storageBucket: "kawa-58848.appspot.com",
  messagingSenderId: "883525077090",
  appId: "1:883525077090:web:c7bc21bca0b8548fee693b",
  measurementId: "G-6FX2GG20FJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const App = () => {
  return(
    <div style={appStyle}>
      <Header />
      <Home />
    </div>
  )
}

export default App;
