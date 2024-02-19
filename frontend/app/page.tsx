"use client";

import Image from "next/image";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function Home() {
  return (
    <main id="homepage">
      <h1 id="title">OOTD</h1>

      <GoogleOAuthProvider clientId="121044225700-6gotpenj58iao2fo2qkm573h11c7hbof.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </GoogleOAuthProvider>

      <p>Some random text</p>
    </main>
  );
}
