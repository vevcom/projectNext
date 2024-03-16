"use client"

import { useUser } from "@/auth/client"
import styles from "./page.module.scss"
import PageWrapper from "@/app/components/PageWrapper/PageWrapper"

export default async function Channels() {

    const {user, status, authorized} = useUser({
        required: true,
    })

    return (
        <PageWrapper title="Varslingskanaler">
            <div className={styles.container}>
                <div>
                    
                </div>
            </div>
        </PageWrapper>
    )
}