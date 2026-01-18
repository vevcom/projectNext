'use client'
import styles from './LicenseChooser.module.scss'
import { SelectNumberPossibleNULL } from '@/UI/Select'
import { readAllLicensesAction } from '@/services/licenses/actions'
import useActionCall from '@/hooks/useActionCall'
import { useCallback, useEffect, useState, useEffectEvent } from 'react'

type PropTypes = {
    defaultLicenseName?: string | null
}

/**
 * A component to choose a license. It makes a CLIENT SIDE request to the server to get the licenses
 * The selection has the name "licenseId"
 * @returns A component to choose a license
 */
export default function LicenseChooser({ defaultLicenseName }: PropTypes) {
    const action = useCallback(() => readAllLicensesAction(), [])
    const { data } = useActionCall(action)

    const [licenseId, setLicenseId] = useState<number | 'NULL'>('NULL')

    const updateLicenseId = useEffectEvent(() => {
        if (!defaultLicenseName) return
        const license = data?.find(licns => licns.name === defaultLicenseName)
        if (license) {
            setLicenseId(license.id)
        }
    })

    useEffect(() => {
        updateLicenseId()
    }, [defaultLicenseName, data])

    return (
        <SelectNumberPossibleNULL
            name="licenseId"
            label="Lisens"
            className={styles.LicenseChooser}
            options={
                [
                    { value: 'NULL', label: 'Ingen lisens' },
                    ...(data?.map(license => ({ value: license.id, label: license.name })) ?? [])
                ] as const
            }
            value={licenseId}
            onChange={setLicenseId}
        />
    )
}
