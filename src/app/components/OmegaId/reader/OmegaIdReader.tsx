"use client"
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';
import { v4 as uuid } from 'uuid'; 
import { QRCodeReaderConfig } from './ConfigVars';
import jwt from 'jsonwebtoken';

function verifyJWT(token: string, publicKey: string) {
    const data = jwt.verify(token, publicKey)
    console.log(data)
}


export default function OmegaIdReader({
    successCallback,
    publicKey,
}: {
    successCallback: () => {},
    publicKey: string,
}) {

    const qrcodeRegionId = uuid();

    useEffect(() => {

        const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, QRCodeReaderConfig, false);

        html5QrcodeScanner.render((data) => {
            //verifyJWT(data, publicKey)
            console.log(data)
        }, (e) => {});

        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);

    return <div id={qrcodeRegionId} />
}