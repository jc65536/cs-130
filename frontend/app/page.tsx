"use client";

import Image from "next/image";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";

const handleLogin = (res: CredentialResponse) => {
  const credential = res.credential;
  console.log(credential);
  fetch("http://localhost:8000/user", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${credential}`
    }
  });
};

export default function Home() {
  return (
    <main id="homepage">
      <h1 id="title">OOTD</h1>

      <GoogleOAuthProvider clientId="121044225700-6gotpenj58iao2fo2qkm573h11c7hbof.apps.googleusercontent.com">
        <GoogleLogin onSuccess={handleLogin}></GoogleLogin>
      </GoogleOAuthProvider>

      <p>Some random text</p>
    </main>
  );
}
