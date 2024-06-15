"use client"
import styles from "./QRButton.module.scss"
import { useRouter } from "next/navigation"
import Button from "@/UI/Button"

export default function QRButton() {
    const router = useRouter()

    return (
        <Button
            className={styles.QRButton}
            onClick={() => { router.push("/lockers/scanner") }}
        >
            Scan QR kode 
        </Button>
    )
}
