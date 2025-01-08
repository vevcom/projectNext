'use client'
import { readLicensesAction } from "@/actions/licenses/read"
import useActionCall from "@/hooks/useActionCall"
import { SelectNumberPossibleNULL } from "../UI/Select"
import { useCallback } from "react"
import styles from './LicenseChooser.module.scss'

/**
 * A component to choose a license. It makes a CLIENT SIDE request to the server to get the licenses
 * The selection has the name "licenseId"
 * @returns A component to choose a license
 */
export default function LicenseChooser() {
    const action = useCallback(readLicensesAction.bind(null, {}), [readLicensesAction])
    const { data } = useActionCall(action)
    
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
        />
    )
}
