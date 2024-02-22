"use client";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

export default function LoginButton(props: { postUrl: string }) {
    const handleLogin = (res: CredentialResponse) => {
        const credential = res.credential;
        console.log(credential);
        fetch(props.postUrl, {
            method: "POST",
            headers: { "Authorization": `Bearer ${credential}` }
        });
    };

    return (
        <GoogleLogin onSuccess={handleLogin}></GoogleLogin>
    );
}
