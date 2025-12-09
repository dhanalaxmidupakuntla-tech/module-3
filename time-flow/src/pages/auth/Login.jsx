import React from "react";
import { useAuth } from "../../lib/auth";

export default function LoginPage(){
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");

  return (
    <div style={{maxWidth:520, margin:'40px auto', padding:20, background:'rgba(255,255,255,0.02)', borderRadius:8}}>
      <h2>Sign in / Sign up</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button onClick={()=>signIn(email,pw)} className="btn primary">Sign in</button>
        <button onClick={()=>signUp(email,pw)} className="btn outline">Sign up</button>
        <button onClick={()=>signInWithGoogle()} className="btn google">Google</button>
      </div>
      <p className="muted">Demo mode: sign up will create a demo session if Firebase not configured.</p>
    </div>
  );
}
