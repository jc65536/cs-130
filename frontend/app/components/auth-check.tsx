"use client";

import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { backend_url } from "../settings";
import { useRouter } from "next/navigation";
import Moai from "./moai";

export default (props: PropsWithChildren) => {
    const [auth, setAuth] = useState(false);

    const router = useRouter();

    useEffect(() => {
        fetch(backend_url("/"), { credentials: "include" })
            .then(async res => {
                setAuth(res.ok);

                if (!res.ok) {
                    router.push("/login");
                }
            });
    }, []);

    if (auth) {
        return props.children;
    } else {
        return (
            <h1 style={{ textAlign: "center" }}>
                <Moai />
                Checking authentication
                <Moai />
            </h1>
        );
    }
};
