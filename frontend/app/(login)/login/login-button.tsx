"use client";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

export default function LoginButton(props: { postUrl: string }) {
    const handleLogin = (res: CredentialResponse) => {
        const credential = res.credential;
        console.log(credential);
        fetch(props.postUrl, {
            method: "POST",
            headers: { "Authorization": `Bearer ${credential}` },
            credentials: "include",
        }).then(_ => fetch("http://localhost:8000", { credentials: "include" }));
    };

    return (
        <GoogleLogin onSuccess={handleLogin}></GoogleLogin>
    );
}
