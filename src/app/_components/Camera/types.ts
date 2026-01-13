import type { Dispatch, SetStateAction, RefObject } from 'react'

export type CameraState = 'Off' | 'Pending' | 'On'

export type CameraFeedProps = {
    videoRef: RefObject<HTMLVideoElement | null>,
    cameraState: CameraState,
    setCameraState: Dispatch<SetStateAction<CameraState>>,
    constraints: MediaStreamConstraints,
    callbackFunction?: () => void,
    width?: number,
    height?: number
}
