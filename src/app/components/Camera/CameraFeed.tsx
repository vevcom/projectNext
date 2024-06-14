"use client"
import { useEffect, useRef, useCallback } from "react"
import { CameraFeedProps, CameraState } from "./Types"


export default function CameraFeed(props: CameraFeedProps) {
    const streamRef = useRef<MediaStream | null>(null)
    const animationFrameRef = useRef<number | null>(null)
    const callbackFunctionRef = useRef<Function | undefined>(props.callbackFunction)

    
    const handleVideoPlay = useCallback(() => {
        const callbackWrapper = () => {
            if (callbackFunctionRef.current) {
                callbackFunctionRef.current()
                animationFrameRef.current = requestAnimationFrame(callbackWrapper)
            }
        }
        callbackWrapper()
        props.setCameraState(CameraState.On)
    }, [])


    const start = useCallback(async () => {
        streamRef.current = await navigator.mediaDevices.getUserMedia(props.constraints)
        .catch((error: Error) => {
            props.setCameraState(CameraState.Off)
            console.error(error)
            return null
        })
        if (!streamRef.current) {
            return
        }
        const video = props.videoRef.current
        if (!video) {
            console.error("videoRef must be linked to a HTMLVideoElement")
            return
        }
        video.srcObject = streamRef.current
        video.play().catch(() => {
            props.setCameraState(CameraState.Off)
            return
        })
        video.addEventListener("loadedmetadata", handleVideoPlay)
    }, [props.constraints])


    const stop = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop()
            })
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
        }
        if (props.videoRef.current) {
            props.videoRef.current.removeEventListener("loadedmetadata", handleVideoPlay)
        }

    }, [])


    useEffect(() => {
        switch (props.cameraState) {
            case CameraState.Pending:
                start()
                break
            case CameraState.Off:
                stop()
                break
            case CameraState.On:
                return stop
        }
    }, [props.cameraState])


    useEffect(() => {
        callbackFunctionRef.current = props.callbackFunction
    }, [props.callbackFunction])


    return (
        <video width={props.width} height={props.height} ref={props.videoRef} playsInline style={{ backgroundColor: 'black' }}></video>
    )
}
