"use client"
import styles from "./page.module.scss"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import CameraFeed from "@/app/components/Camera/CameraFeed"
import { CameraState } from "@/app/components/Camera/Types"
import Button from "@/app/components/UI/Button"
import jsQR from "jsqr"

export default function Scanner() {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [cameraState, setCameraState] = useState<CameraState>(CameraState.Off)
    const [hasAsked, setHasAsked] = useState<boolean>(false)
    const router = useRouter()

    const width = 400
    const height = 400


    const constraints = {
        video: {
            facingMode: { ideal: "environment" },
            width,
            height
        }
    }

    const callBackFunction = useCallback(() => {
        // The video feed is drawn on a canvas to extract the imageData
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!videoRef.current || !ctx) {
            throw new Error("videoRef.current or ctx is undefined")
        }
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, canvas.width, canvas.height)
        if (code) {
            router.push(code.data)
        }
    }, [router])

    useEffect(() => {
        setCameraState(CameraState.Pending)
        setHasAsked(true)
    }, [])

    useEffect(() => {
        if (hasAsked && cameraState == CameraState.Off) {
            router.push("/lockers")
        }
    }, [cameraState, hasAsked])

    return (
        <>
            <h1 className={styles.title}>Scan QR Kode</h1>
            <div className={styles.camera}>
                <CameraFeed 
                    videoRef={videoRef} 
                    cameraState={cameraState}
                    setCameraState={setCameraState} 
                    constraints={constraints}
                    width={width}
                    height={height}
                    callbackFunction={callBackFunction}
                /> 
     
                <Button className={styles.button} onClick={() => { setCameraState(CameraState.Off) }}>Avbryt</Button> 
            </div>
        </>
    )
}
