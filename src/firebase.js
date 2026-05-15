import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOjkrHNjIpV-f3wDSsd8cR3dM__sq1AnY",
  authDomain: "casa-f3ad7.firebaseapp.com",
  projectId: "casa-f3ad7",
  storageBucket: "casa-f3ad7.firebasestorage.app",
  messagingSenderId: "218029087390",
  appId: "1:218029087390:web:60e24c2bc3795f5a48798f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
