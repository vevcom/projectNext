'use client'
import styles from './EditJobAd.module.scss'
import Form from '@/components/Form/Form'
import { updateJobAdAction } from '@/actions/jobAds/update'
import { destroyJobAdAction } from '@/actions/jobAds/destroy'
import TextInput from '@/components/UI/TextInput'
import Textarea from '@/components/UI/Textarea'
import useEditing from '@/hooks/useEditing'
import { useRouter } from 'next/navigation'
import type { ExpandedJobAd } from '@/server/jobAds/Types'
import type { ReactNode } from 'react'

type PropTypes = {
    jobAd: ExpandedJobAd
    children?: ReactNode
}

/**
 * This component renders children if editmode is off and news admin tools if editmode is on
 * pass it not: id of article to make sure not to display that article
 */
export default function EditJobAd({ jobAd, children }: PropTypes) {
    const { refresh, push } = useRouter()
    //TODO: chack visibility
    const canEdit = useEditing()
    if (!canEdit) return children

    //TODO: add publish functionality with visibility
    const isPublished = false //temp

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
            <div className={styles.visibility}>
                Her kommer visibility settings
                <Form
                    action={async () => ({success: true})}
                    submitText="oppdater synlighet"

                >

                </Form>
            </div>
        </div>
    )
}
