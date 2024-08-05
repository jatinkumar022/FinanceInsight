// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEDT1h4tDH53Pu4FUSCuJqO8RwP7Pi6uY",
  authDomain: "financeinsight-3c7e7.firebaseapp.com",
  projectId: "financeinsight-3c7e7",
  storageBucket: "financeinsight-3c7e7.appspot.com",
  messagingSenderId: "775007362737",
  appId: "1:775007362737:web:c4a534c92d4ed6d88f4c90",
  measurementId: "G-MQG8B4M17S",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, doc, setDoc };
