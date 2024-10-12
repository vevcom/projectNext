'use client'
import styles from './OmegaIdElement.module.scss'
import { generateOmegaIdAction } from '@/actions/omegaid/generate'
import { readJWTPayload } from '@/jwt/jwtReadUnsecure'
import { compressOmegaId } from '@/services/omegaid/compression'
import { useQRCode } from 'next-qrcode'
import { useEffect, useState } from 'react'

const EXPIRY_THRESHOLD = 60

type PropTypes = {
    token: string,
}

export default function OmegaIdElement({ token }: PropTypes) {
    const [tokenState, setTokenState] = useState(token)

    const { SVG } = useQRCode()

    const JWTPayload = readJWTPayload(token)

    const [expiryTime, setExpiryTime] = useState(new Date((JWTPayload.exp - EXPIRY_THRESHOLD) * 1000))

    useEffect(() => {
        const interval = setInterval(async () => {
            if (expiryTime < new Date()) {
                const results = await generateOmegaIdAction()
                if (!results.success) {
                    console.error(results)
                    throw new Error('Failed to reload the qr code')
                }

                setTokenState(results.data)

                const pld = readJWTPayload(results.data)

                setExpiryTime(new Date((pld.exp - EXPIRY_THRESHOLD) * 1000))
            }
        }, 15 * 1000)

        return () => clearInterval(interval)
    })

    return <div className={styles.OmegaIdElement}>
        <SVG
            text={compressOmegaId(tokenState)}
        />
    </div>
}
