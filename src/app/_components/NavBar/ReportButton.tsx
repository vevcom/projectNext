"use client"
import Link from 'next/link'
import styles from "./ReportButton.module.scss"

export default function ReportButton(){
    return(
       <div className={styles.reportButton}>
            <Link href="/report">
            <img width={30} className={styles.reportPicture} src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F78%2F78211.png&f=1&nofb=1&ipt=1eefa7471977b662a50c02ffab8e76ac4de8d70b126f517ce68ccc8c245d7027&ipo=images"></img>
            </Link>
        </div>     
       
    )
}