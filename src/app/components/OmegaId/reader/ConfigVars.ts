import { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner"

export const QRCodeReaderConfig: Html5QrcodeScannerConfig = {
    fps: 4,
    disableFlip: true,
    qrbox: {
        width: 400,
        height: 400,
    },
}