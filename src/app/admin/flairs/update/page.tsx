'use client'
import styles from './page.module.scss'
import { readAllFlairsAction } from '@/services/flairs/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import Image from '@/components/Image/Image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { flairImageType } from '@/services/flairs/types'


export default function FlairUpdatePage() {
    const [flairs, setFlairs] = useState<flairImageType[] | null>(null)
    useEffect(() => {
        async function loadFlairs() {
            const res = unwrapActionReturn(await readAllFlairsAction())
            if (res.length !== 0) {
                setFlairs(res)
                return
            }
            setFlairs([])
        }
        loadFlairs()
    }, [])

    if (!flairs) {
        return <p>Laster inn...</p>
    }
    if (flairs.length === 0) {
        return <p>No capes found</p>
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.flairContainer}>
                {flairs.map((data, index) => (
                    <Link className={styles.imageContainer} key={index} href={`/admin/flairs/update/${data.flairId}`}>
                        <h3>{data.name}</h3>
                        <Image width={100} alt={data.alt} image={data}></Image>
                    </Link>
                ))}
            </div>
        </div >)
}
