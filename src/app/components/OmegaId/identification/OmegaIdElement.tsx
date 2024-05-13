"use client"
import { readJWTPayload } from '@/utils/jwt';
import { useQRCode } from 'next-qrcode';

export default function OmegaIdElement({
    token,
}: {
    token: string,
}) {

    const { SVG } = useQRCode()

    const JWTPyaload = readJWTPayload<{
        gn?: string,
        sn?: string,
    }>(token)

    const firstname = JWTPyaload.gn ?? ""
    const lastname = JWTPyaload.sn ?? ""

    return <div>
        <SVG
            text={token}
        />

        <p>{firstname} {lastname}</p>
    </div>
}