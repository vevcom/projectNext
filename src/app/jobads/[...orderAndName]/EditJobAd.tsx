'use client'
import styles from './EditJobAd.module.scss'
import Form from '@/components/Form/Form'
import { updateJobAdAction } from '@/actions/jobAds/update'
import { destroyJobAdAction } from '@/actions/jobAds/destroy'
import TextInput from '@/components/UI/TextInput'
import Textarea from '@/components/UI/Textarea'
import useEditing from '@/hooks/useEditing'
import { useRouter } from 'next/navigation'
import type { ExpandedJobAd } from '@/services/jobAds/Types'
import type { ReactNode } from 'react'

type PropTypes = {
    jobAd: ExpandedJobAd
    children?: ReactNode
}

/**
 * This component renders children if editmode is off and news admin tools if editmode is on
 * pass it not: id of jobad to make sure not to display that jobad
 * @param jobAd - the jobad to edit
 * @param children - children to render if editmode is off
 */
export default function EditJobAd({ jobAd, children }: PropTypes) {
    const { push } = useRouter()
    //TODO: chack visibility
    const canEdit = useEditing({})
    if (!canEdit) return children

    const updateAction = updateJobAdAction.bind(null, jobAd.id)

    return (
        <div className={styles.EditJobAd}>
            <div className={styles.update}>
                <Form
                    action={updateAction}
                    successCallback={(data) => {
                        push(`/jobads/${data?.orderPublished}/${data?.articleName}`)
                    }}
                    submitText="oppdater"
                >
                    <TextInput
                        color="white"
                        defaultValue={jobAd.company}
                        label="Bedrift"
                        name="company"/>
                    <Textarea defaultValue={jobAd.description || ''} label="beskrivelse" name="description" />
                </Form>
                <Form
                    action={destroyJobAdAction.bind(null, jobAd.id)}
                    successCallback={() => {
                        push('/jobads')
                    }}
                    submitText="slett annonse"
                    confirmation={{
                        confirm: true,
                        text: 'Er du sikker på at du vil slette denne annonsen? Dette kan ikke angres.'
                    }}
                    submitColor="red"
                >
                </Form>
            </div>
        </div>
    )
}
