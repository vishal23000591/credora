import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDD5YseqFPV5hEWN7wZIQw3G-Cng_iYBnc",
  authDomain: "revaaiauthenticator.firebaseapp.com",
  projectId: "revaaiauthenticator",
  storageBucket: "revaaiauthenticator.appspot.com", // ✅ corrected
  messagingSenderId: "330052696318",
  appId: "1:330052696318:web:db0efd97db126f7389cdaf",
  measurementId: "G-HJMC5NCSBN" // optional
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
