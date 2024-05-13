"use client"
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';
import { v4 as uuid } from 'uuid'; 
import { QRCodeReaderConfig } from './ConfigVars';
import { OmegaId, OmegaIdJWT } from '@/server/omegaid/Types';
import { JWT } from '@/utils/jwt';
import { JWT_ISSUER } from '@/auth/ConfigVars';
import { OmegaJWTAudience } from '@/auth/Types';
import { ActionReturn } from '@/actions/Types';

async function parseJWT(token: string, publicKey: string): Promise<ActionReturn<OmegaId>> {

    function invalidJWT(message?: string): ActionReturn<OmegaId> {
        return {
            success: false,
            errorCode: 'JWT INVALID',
            error: message ? [{
                message: message
            }] : []
        }
    }

    // TODO: This only works in safari :///

    const tokenS = token.split('.')
    if (tokenS.length !== 3) {
        return invalidJWT("Wrong formatted QR code")
    }

    const keyStripped = publicKey
        .replaceAll('\n', '')
        .replace('-----BEGIN PUBLIC KEY-----', '')
        .replace('-----END PUBLIC KEY-----', '')
        .trim()

    const key = await crypto.subtle.importKey(
        "spki", // Subject Public Key Info
        Buffer.from(keyStripped, 'base64'),
        {
            name: 'ECDSA',
            namedCurve: 'P-256',
        },
        true,
        [ "verify" ]
    )

    console.log(key)

    const signValid = await crypto.subtle.verify(
        {
            name: 'ECDSA',
            hash: 'SHA-256'
        },
        key,
        Buffer.from(tokenS[2], 'base64'),
        Buffer.from(tokenS[0] + '.' + tokenS[1]),
    )


    if (!signValid) {
        return invalidJWT("Invalid JWT signature");
    }

    const payload = JSON.parse(
        Buffer.from(tokenS[1], 'base64').toString('utf-8')
    ) as OmegaIdJWT & JWT

    if (
        !payload.exp ||
        !payload.iss ||
        !payload.aud ||
        !payload.sub ||
        !payload.usrnm ||
        !payload.sn ||
        !payload.gn
    ) {
        return invalidJWT("Missing mandatory fields");
    }

    if (new Date(payload.exp * 1000) < new Date()) {
        return invalidJWT("Token expired")
    }

    if (payload.iss !== JWT_ISSUER) {
        return invalidJWT("Invalid issuer")
    }

    if (payload.aud !== 'omegaid' satisfies OmegaJWTAudience) {
        return invalidJWT("Invalid audience")
    }

    return {
        success: true,
        data: {
            id: payload.sub,
            username: payload.usrnm,
            firstname: payload.gn,
            lastname: payload.sn,
        }
    }
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

        html5QrcodeScanner.render(async (data) => {
            const parse = await parseJWT(data, publicKey)
            if (!parse.success) {
                console.log(parse)
                return;
            }

            console.log(parse.data)
            
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