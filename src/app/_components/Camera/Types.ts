import type { Dispatch, SetStateAction, RefObject } from 'react'


export type CameraState = 'Off' | 'Pending' | 'On'

export interface CameraFeedProps {
    videoRef: RefObject<HTMLVideoElement>,
    cameraState: CameraState,
    setCameraState: Dispatch<SetStateAction<CameraState>>,
    constraints: MediaStreamConstraints
    callbackFunction?: () => void,
    width?: number,
    height?: number
}

