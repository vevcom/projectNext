'use client'

import styles from './OmbulAdmin.module.scss'
import Form from '@/app/components/Form/Form'
import { updateOmbulAction, updateOmbulFileAction } from '@/actions/ombul/update'
import NumberInput from '@/app/components/UI/NumberInput'
import FileInput from '@/app/components/UI/FileInput'
import { destroyOmbulAction } from '@/actions/ombul/destroy'
import useEditing from '@/hooks/useEditing'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import type { ExpandedOmbul } from '@/server/ombul/Types'

type PropTypes = {
    ombul: ExpandedOmbul
    children: ReactNode
}

/**
 * The admin panel for the ombul to change cover image (using cms image) anf update year, number and file.
 * The component is only shown if editmode is enabled.
 * @param ombul - The obul (expanded) to be edited
 * @param children - The cmsimage cover. Rendered on server side.
 * @returns
 */
export default function OmbulAdmin({
    ombul,
    children,
}: PropTypes) {
    const { push, refresh } = useRouter()
    const canUpdate = useEditing([['OMBUL_UPDATE']])
    const canDestroy = useEditing([['OMBUL_DESTROY']])

    const updateOmbulActionBind = updateOmbulAction.bind(null, ombul.id)
    const updateOmbulFileActionBind = updateOmbulFileAction.bind(null, ombul.id)

    const handleChange = async (newOmbul: ExpandedOmbul | undefined) => {
        if (!newOmbul) return
        push(`/ombul/${newOmbul.year}/${newOmbul.name}`)
        refresh()
    }

    const handleDestroy = async () => {
        push('/ombul')
        refresh()
    }
    if (!canUpdate && !canDestroy) return null

    return (
        <div className={styles.OmbulAdmin}>
            <h2>Admin</h2>
            <div className={styles.left}>
                {
                    canUpdate && (
                        <>
                            <Form
                                action={updateOmbulActionBind}
                                successCallback={handleChange}
                                submitText="Oppdater"
                            >
                                <NumberInput
                                    name="year"
                                    label="År"
                                    defaultValue={ombul.year}
                                />
                                <NumberInput
                                    name="issueNumber"
                                    label="Nummer"
                                    defaultValue={ombul.issueNumber}
                                />
                            </Form>
                            <Form
                                action={updateOmbulFileActionBind}
                                successCallback={handleChange}
                                submitText="Oppdater fil"
                            >
                                <FileInput name="ombulFile" label="ombul fil" color="primary" />
                            </Form>
                        </>
                    )
                }
                {
                    canDestroy && (
                        <Form
                            action={destroyOmbulAction.bind(null, ombul.id)}
                            successCallback={handleDestroy}
                            submitText="Slett"
                            submitColor="red"
                            confirmation={{
                                confirm: true,
                                text: 'Sikker på at du vil slette ombul? Dette kan ikke angres.',
                            }}
                        ></Form>
                    )
                }
            </div>
            <div className={styles.right}>
                {
                    canUpdate && (
                        <div className={styles.coverImage}>
                            {children}
                        </div>
                    )
                }
            </div>
        </div>
    )
}
