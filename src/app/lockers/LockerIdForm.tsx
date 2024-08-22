'use client'
import styles from './LockerIdForm.module.scss'
import NumberInput from '@/components/UI/NumberInput'
import Button from '@/components/UI/Button'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LockerIdForm() {
    const [lockerId, setLockerId] = useState('1')
    const router = useRouter()

    const handleLockerIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLockerId(event.target.value)
    }

    const handleGoToLockerButton = () => {
        router.push(`/lockers/${lockerId}`)
    }

    return (
        <>
            <NumberInput
                label="Skapnummer"
                min="1"
                value={lockerId}
                onChange={handleLockerIdChange}
            />
            <Button
                className={styles.goToLockerButton}
                onClick={handleGoToLockerButton}
            >
                Gå til skap
            </Button>
        </>
    )
}
