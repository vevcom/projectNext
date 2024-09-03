'use client'
import styles from './EditNews.module.scss'
import Form from '@/components/Form/Form'
import { updateNewsAction } from '@/actions/news/update'
import { destroyNewsAction } from '@/actions/news/destroy'
import TextInput from '@/components/UI/TextInput'
import Textarea from '@/components/UI/Textarea'
import DateInput from '@/components/UI/DateInput'
import useEditing from '@/hooks/useEditing'
import { useRouter } from 'next/navigation'
import type { ExpandedNewsArticle } from '@/services/news/Types'
import type { ReactNode } from 'react'

type PropTypes = {
    news: ExpandedNewsArticle
    children?: ReactNode
}

/**
 * This component renders children if editmode is off and news admin tools if editmode is on
 * pass it not: id of article to make sure not to display that article
 */
export default function EditNews({ news, children }: PropTypes) {
    const { refresh, push } = useRouter()
    //TODO: chack visibility
    const canEdit = useEditing({})
    if (!canEdit) return children

    // TODO: VISINILITY ADMIN

    const updateAction = updateNewsAction.bind(null, news.id)

    return (
        <div className={styles.EditNews}>
            <div className={styles.update}>
                <Form
                    action={updateAction}
                    successCallback={(data) => {
                        push(`/news/${data?.orderPublished}/${data?.articleName}`)
                        refresh()
                    }}
                    submitText="oppdater"
                >
                    <TextInput
                        color="white"
                        defaultValue={news.articleName}
                        label="navn"
                        name="name"
                    />
                    <DateInput
                        color="white"
                        defaultValue={news.endDateTime}
                        label="sluttdato"
                        name="endDateTime"
                    />
                    <Textarea defaultValue={news.description || ''} label="beskrivelse" name="description" />
                </Form>
                <Form
                    action={destroyNewsAction.bind(null, news.id)}
                    successCallback={() => {
                        push('/news')
                        refresh()
                    }}
                    submitText="slett nyhet"
                    confirmation={{
                        confirm: true,
                        text: 'Er du sikker på at du vil slette denne nyheten? Dette kan ikke angres.'
                    }}
                    submitColor="red"
                >
                </Form>
            </div>
            <div className={styles.visibility}>
                Her kommer visibility settings

            </div>

            <div className={styles.publish}>

            </div>
        </div>
    )
}
