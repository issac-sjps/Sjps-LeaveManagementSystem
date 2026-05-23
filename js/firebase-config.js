import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyACy13Fswrf6BMYC6iQ1ri2O352JL3uC2w",
  authDomain: "sjps-leavemanagementsystem.firebaseapp.com",
  projectId: "sjps-leavemanagementsystem",
  storageBucket: "sjps-leavemanagementsystem.firebasestorage.app",
  messagingSenderId: "383780552116",
  appId: "1:383780552116:web:b556b8a6e81382c31f06e1",
  measurementId: "G-W5GNX11M95"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
