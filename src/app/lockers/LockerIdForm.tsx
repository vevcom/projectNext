'use client'
import styles from './LockerIdForm.module.scss'
import NumberInput from '@/components/UI/NumberInput'
import Button from '../_components/UI/Button'
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
            <Button
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                    const child = event.currentTarget.firstChild as HTMLElement
                    if (child) {
                        child.click()
                    }
                }}
            >
                <Link
                    href={`/lockers/${lockerId}`}
                    className={styles.goToLockerLink}
                >
                    Gå til skap
                </Link>
            </Button>
            
        </>
    )
}
