import { useEffect, useState, createContext, useContext } from "react";
import { initFirebase, firebaseAuth } from "./firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initFirebase().catch(()=>{ /* ignore */ }).finally(()=>setReady(true));
    if (firebaseAuth()) {
      const unsub = firebaseAuth().onAuthStateChanged(u => {
        if (u) setUser({ id: u.uid, email: u.email });
        else setUser(null);
      });
      return unsub;
    } else {
      const s = sessionStorage.getItem("tf_demo_user");
      if (s) setUser(JSON.parse(s));
      setReady(true);
    }
  }, []);

  async function signIn(email, password) {
    const auth = firebaseAuth();
    if (auth) {
      const res = await auth.signInWithEmailAndPassword(email, password);
      setUser({ id: res.user.uid, email: res.user.email });
    } else {
      const id = "demo_" + btoa(email).slice(0,8);
      const u = { id, email };
      sessionStorage.setItem("tf_demo_user", JSON.stringify(u));
      setUser(u);
    }
  }

  async function signUp(email, password) {
    const auth = firebaseAuth();
    if (auth) {
      const res = await auth.createUserWithEmailAndPassword(email, password);
      setUser({ id: res.user.uid, email: res.user.email });
    } else {
      const id = "demo_" + btoa(email).slice(0,8);
      const u = { id, email };
      sessionStorage.setItem("tf_demo_user", JSON.stringify(u));
      setUser(u);
    }
  }

  async function signInWithGoogle() {
    const auth = firebaseAuth();
    if (auth) {
      const provider = new window.firebase.auth.GoogleAuthProvider();
      await auth.signInWithPopup(provider);
    } else {
      const id = "demo_google_" + Math.random().toString(36).slice(2,8);
      const u = { id, email: id + "@demo.local" };
      sessionStorage.setItem("tf_demo_user", JSON.stringify(u));
      setUser(u);
    }
  }

  async function signOut() {
    const auth = firebaseAuth();
    if (auth) await auth.signOut();
    sessionStorage.removeItem("tf_demo_user");
    setUser(null);
  }

  return {
    user, ready, signIn, signUp, signInWithGoogle, signOut
  };
}
