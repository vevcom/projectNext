'use client'

import { useEffect } from "react";

export default function PwaInstaller({
    NODE_ENV
}: {
    NODE_ENV: string
}) {

    useEffect(() => {
        if (!navigator.serviceWorker.controller) {
            navigator.serviceWorker.register("/sw.js").then(function (reg) {
                console.log("Service worker has been registered for scope: " + reg.scope);
            });
        }
    })

    return <></>
}