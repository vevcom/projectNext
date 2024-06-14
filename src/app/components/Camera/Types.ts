import { Dispatch, SetStateAction } from "react"

export interface CameraFeedProps {
    videoRef: React.RefObject<HTMLVideoElement>,
    cameraState: CameraState,
    setCameraState: Dispatch<SetStateAction<CameraState>>,
    constraints: MediaStreamConstraints
    callbackFunction?: Function,
    width?: number,
    height?: number
}

export enum CameraState {
    Off,
    Pending,
    On
}
