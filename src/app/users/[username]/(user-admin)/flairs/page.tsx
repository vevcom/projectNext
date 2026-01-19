'use client'

import styles from './page.module.scss'
import { changeAssignment } from './flairAssigner'
import { getOwnedFlairsId, getUserId } from './getData'
import { readAllFlairsAction } from '@/services/flairs/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import Image from '@/components/Image/Image'
import { useEffect, useState, } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { FlairImageType } from '@/services/flairs/types'
import type { PropTypes } from '@/app/users/[username]/page'


type setUseStateBool = Dispatch<SetStateAction<boolean>>

async function changeAssignmentHandler(userId: number, flairId: number, setUpdate: setUseStateBool, update: boolean) {
    await changeAssignment(userId, flairId)
    setUpdate(!update)
}


export default function Flair({ params }: PropTypes) {
    const [flairs, setFlairs] = useState<FlairImageType[] | null>(null)
    const [update, setUpdate] = useState(false)
    const [username, setUsername] = useState<string | null>(null)
    const [userId, setUserId] = useState<number | null>(null)
    const [ownedFlairs, setOwnedFlairs] = useState<number[]>([])

    useEffect(() => {
        async function loadFlairs() {
            //get username
            const param = await params
            if (!param.username) {
                return
            }
            setUsername(param.username)
            // Get user ID
            const userIdRes = await getUserId(param.username)
            if (!userIdRes) {
                return
            }
            setUserId(userIdRes)

            //get owned flairs
            const ownedFlairsRes = await getOwnedFlairsId(userIdRes)
            setOwnedFlairs(ownedFlairsRes)

            //get all flairs
            const res = unwrapActionReturn(await readAllFlairsAction())
            if (res.length !== 0) {
                setFlairs(res)
                return
            }
            setFlairs([])
        }
        loadFlairs()
    }, [])

    useEffect(() => {
        async function loadOwnedFlairs() {
            //get owned flairs
            if (!userId) {
                return
            }
            const ownedFlairsRes = await getOwnedFlairsId(userId)
            setOwnedFlairs(ownedFlairsRes)
        }
        loadOwnedFlairs()
    }, [update])


    if (!flairs || !username || !userId) {
        return <p>Laster inn...</p>
    }
    if (flairs.length === 0) {
        return <p>No capes found</p>
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.flairContainer}>
                {flairs.map((data, index) => (
                    <div
                        className={styles.imageContainer}
                        onClick={() => (changeAssignmentHandler(userId, data.flairId, setUpdate, update))}
                        key={index}
                    >
                        {ownedFlairs.includes(data.flairId)
                            ?
                            <Image className={styles.ownedFlair} width={100} alt={data.alt} image={data}></Image>
                            :
                            <Image className={styles.unOwnedFlair} width={100} alt={data.alt} image={data}></Image>
                        }

                    </div>
                ))}
            </div>
        </div >)
}
