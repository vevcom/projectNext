"use client"
import { useCallback, useRef, useState } from "react"
import CameraFeed from "@/app/components/Camera/CameraFeed"
import { CameraState } from "@/app/components/Camera/Types"
import jsQR from "jsqr"

export default function Scanner() {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [cameraState, setCameraState] = useState<CameraState>(CameraState.Off)

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
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!videoRef.current || !ctx) {
            throw new Error("videoRef.current or ctx are undefined")
        }
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        const code = jsQR(data, canvas.width, canvas.height)
        console.log(code)
    }, [])


    return (
        <div className="camera">
            <CameraFeed 
                videoRef={videoRef} 
                cameraState={cameraState}
                setCameraState={setCameraState} 
                constraints={constraints}
                width={width}
                height={height}
                callbackFunction={callBackFunction}
            /> 

            <button onClick={() => {setCameraState(CameraState.Pending)}}>start</button> 
            <button onClick={() => {setCameraState(CameraState.Off)}}>stop</button> 
        </div>
         
    )
}
