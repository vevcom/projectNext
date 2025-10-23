'use client'
import styles from './EditNews.module.scss'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import Textarea from '@/components/UI/Textarea'
import DateInput from '@/components/UI/DateInput'
import useEditing from '@/hooks/useEditing'
import { destroyNewsAction, updateNewsAction } from '@/services/news/actions'
import { formatVevenUri } from '@/lib/urlEncoding'
import { configureAction } from '@/services/configureAction'
import { useRouter } from 'next/navigation'
import type { ExpandedNewsArticle } from '@/services/news/types'
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

    const updateAction = configureAction(
        updateNewsAction,
        { params: { id: news.id } }
    )

    return (
        <div className={styles.EditNews}>
            <div className={styles.update}>
                <Form
                    action={updateAction}
                    navigateOnSuccess={(data) => `/news/${data ? formatVevenUri(data.articleName, data.id) : ''}`}
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
                    action={
                        configureAction(
                            destroyNewsAction,
                            { params: { id: news.id } }
                        )
                    }
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
