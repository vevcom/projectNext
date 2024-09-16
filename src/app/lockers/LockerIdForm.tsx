'use client'
import styles from './LockerIdForm.module.scss'
import NumberInput from '@/components/UI/NumberInput'
import React, { useState } from 'react'
import Link from 'next/link'

export default function LockerIdForm() {
    const [lockerId, setLockerId] = useState('1')

    const handleLockerIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLockerId(event.target.value)
    }

    return (
        <>
            <NumberInput
                label="Skapnummer"
                min="1"
                value={lockerId}
                onChange={handleLockerIdChange}
            />
            <Link
                href={`/lockers/${lockerId}`}
                className={styles.goToLockerButton}
            >
                Gå til skap
            </Link>
        </>
    )
}
