'use client'
import { useEffect, useRef, useCallback } from 'react'
import type { CameraFeedProps } from './types'


export default function CameraFeed({
    setCameraState,
    constraints,
    videoRef,
    cameraState,
    callbackFunction,
    width,
    height
}: CameraFeedProps) {
    const streamRef = useRef<MediaStream | null>(null)
    const animationFrameRef = useRef<number | null>(null)
    const callbackFunctionRef = useRef<(() => void) | undefined>(callbackFunction)

    const handleVideoPlay = useCallback(() => {
        const callbackWrapper = () => {
            if (callbackFunctionRef.current) {
                callbackFunctionRef.current()
                animationFrameRef.current = requestAnimationFrame(callbackWrapper)
            }
        }
        callbackWrapper()
        setCameraState('On')
    }, [setCameraState])


    const start = useCallback(async () => {
        streamRef.current = await navigator.mediaDevices.getUserMedia(constraints)
            .catch((error: Error) => {
                setCameraState('Off')
                console.error(error)
                return null
            })
        if (!streamRef.current) {
            return
        }
        const video = videoRef.current
        if (!video) {
            console.error('videoRef must be linked to a HTMLVideoElement')
            return
        }
        video.srcObject = streamRef.current
        video.play().catch((error: Error) => {
            setCameraState('Off')
            console.error(error)
            return
        })
        video.addEventListener('loadedmetadata', handleVideoPlay)
    }, [setCameraState, videoRef, handleVideoPlay, constraints])


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
        if (videoRef.current) {
            videoRef.current.removeEventListener('loadedmetadata', handleVideoPlay)
        }
    }, [videoRef, handleVideoPlay])


    useEffect(() => {
        switch (cameraState) {
            case 'Pending':
                start()
                break
            case 'Off':
                stop()
                break
            case 'On':
                return stop
            default:
                return undefined
        }
        return undefined
    }, [cameraState, start, stop])


    useEffect(() => {
        callbackFunctionRef.current = callbackFunction
    }, [callbackFunction])


    return (
        <video
            width={width}
            height={height}
            ref={videoRef}
            playsInline
            style={{ backgroundColor: 'black' }}
        >
        </video>
    )
}
