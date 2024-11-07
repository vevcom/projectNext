'use client'
import { QRCodeReaderConfig } from './ConfigVars'
import styles from './OmegaIdReader.module.scss'
import { parseJWT } from '@/jwt/parseJWTClient'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { OmegaId } from '@/services/omegaid/Types'
import { decomporessOmegaId as decompressOmegaId } from '@/services/omegaid/compress'

/**
 * Renders a component for reading OmegaId QR codes.
 *
 * @param successCallback - A callback function that will be called when a valid QR code is scanned.
 *                          It receives the user data and the token as parameters.
 * @param publicKey - The public key used for verifying the QR code token.
 *                    Use the action readOmegaIdPublicKey() to read the public key
 * @param expiryOffset - An optional offset (in seconds) to adjust the expiry time of the QR code token.
 * @param debounceThreshold - An optional threshold (in milliseconds) to prevent duplicate reads.
 * @param singleRead - An optional flag indicating whether only a single QR code should be read.
 * @returns The rendered component for reading OmegaId QR codes.
 */
export default function OmegaIdReader({
    successCallback,
    publicKey,
    expiryOffset,
    debounceThreshold,
    singleRead,
}: {
    successCallback: (user: number, token: string) => Promise<{
        success: boolean,
        text: string,
    }>,
    publicKey: string,
    expiryOffset?: number,
    debounceThreshold?: number,
    singleRead?: boolean,
}) {
    const [feedback, setFeedBack] = useState<{
        status: 'EMPTY' | 'ERROR' | 'SUCCESS' | 'WAITING',
        text: string,
    }>({
        status: 'EMPTY',
        text: '',
    })

    const qrcodeRegionId = uuid()

    useEffect(() => {
        const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, QRCodeReaderConfig, false)

        let lastReadTime = 0
        let lastReadUserId = -1

        html5QrcodeScanner.render(async (rawToken) => {
            const token = decompressOmegaId(rawToken)
            if (!token.success) {
                setFeedBack({
                    status: 'ERROR',
                    text: 'Ugyldig QR kode'
                })
                return
            }
            const parse = await parseJWT(token.data, publicKey, expiryOffset ?? 100, 'omegaid')
            if (!parse.success) {
                const msg = parse.error?.map(e => e.message).join(' / ') ?? 'Ukjent feil'

                setFeedBack({
                    status: 'ERROR',
                    text: msg,
                })
                return
            }

            const userId = parse.data

            if (userId === lastReadUserId && Date.now() - lastReadTime < (debounceThreshold ?? 5000)) {
                lastReadTime = Date.now()
                return
            }

            setFeedBack({
                status: 'WAITING',
                text: '...',
            })

            const results = await successCallback(userId, token.data)

            if (results.success && (singleRead ?? false)) {
                html5QrcodeScanner.clear()
            }

            setFeedBack({
                status: results.success ? 'SUCCESS' : 'ERROR',
                text: results.text,
            })

            lastReadUserId = userId
            lastReadTime = Date.now()
        }, () => {})

        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error('Failed to clear html5QrcodeScanner. ', error)
            })
        }
    }, [])

    return <div className={styles.OmegaIdReader}>
        <div id={qrcodeRegionId} />

        <div className={`
            ${styles.feedbackBox}
            ${(feedback.status === 'SUCCESS' && !singleRead) ? styles.success : ''}
            ${feedback.status === 'ERROR' ? styles.error : ''}
            ${feedback.status === 'WAITING' ? styles.waiting : ''}
        `} >
            <span>{feedback.text}</span>
        </div>
    </div>
}
