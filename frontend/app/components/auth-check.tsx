"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Moai from "./moai";
import { useHostContext } from "./host-context";

export default (props: PropsWithChildren) => {
    const backend_url = useHostContext();
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
