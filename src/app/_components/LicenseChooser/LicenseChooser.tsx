'use client'
import styles from './LicenseChooser.module.scss'
import { SelectNumberPossibleNULL } from '@/UI/Select'
import { readAllLicensesAction } from '@/actions/licenses/read'
import useActionCall from '@/hooks/useActionCall'
import { useCallback, useEffect, useState } from 'react'

type PropTypes = {
    defaultLicenseName?: string | null
}

/**
 * A component to choose a license. It makes a CLIENT SIDE request to the server to get the licenses
 * The selection has the name "licenseId"
 * @returns A component to choose a license
 */
export default function LicenseChooser({ defaultLicenseName }: PropTypes) {
    const action = useCallback(readAllLicensesAction, [readAllLicensesAction])
    const { data } = useActionCall(action)

    const [licenseId, setLicenseId] = useState<number | 'NULL'>('NULL')
    useEffect(() => {
        if (!defaultLicenseName)  return
        const license = data?.find(license => license.name === defaultLicenseName)
        if (license) {
            setLicenseId(license.id)
        }
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
