import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const provider = new GoogleAuthProvider();

export let currentUser = null;
export let currentRole = null; // null | 'clerk' | 'admin'

export function initAuth(onReady) {
  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) {
      const snap = await getDoc(doc(db, "accounts", user.uid));
      currentRole = snap.exists() ? snap.data().role : null;
    } else {
      currentRole = null;
    }
    onReady(user, currentRole);
  });
}

export async function loginWithGoogle() {
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    console.error("Login failed", e);
  }
}

export async function logout() {
  await signOut(auth);
}

export function isAdmin() { return currentRole === "admin"; }
export function isClerk() { return currentRole === "clerk" || currentRole === "admin"; }
