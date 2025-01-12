'use client'
import styles from './LicenseChooser.module.scss'
import { SelectNumberPossibleNULL } from '@/UI/Select'
import { readLicensesAction } from '@/actions/licenses/read'
import useActionCall from '@/hooks/useActionCall'
import { useCallback } from 'react'

type PropTypes = {
    defaultLicenseName?: string | null
}

/**
 * A component to choose a license. It makes a CLIENT SIDE request to the server to get the licenses
 * The selection has the name "licenseId"
 * @returns A component to choose a license
 */
export default function LicenseChooser({ defaultLicenseName }: PropTypes) {
    const action = useCallback(readLicensesAction.bind(null, {}), [readLicensesAction])
    const { data } = useActionCall(action)

    const defaultLicenseId = data?.find(license => license.name === defaultLicenseName)?.id

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
            defaultValue={defaultLicenseId ?? 'NULL'}
        />
    )
}
