'use client'
import styles from './NewsPublishControls.module.scss'
import Form from '@/app/_components/Form/Form'
import { publishNewsAction, updateVisibilityAction } from '@/actions/news/update'
import { useRouter } from 'next/navigation'
import type { ExpandedNewsArticle } from '@/services/news/Types'

type PropTypes = {
    news: ExpandedNewsArticle
}

export default function NewsPublishControls({ news }: PropTypes) {
    const { refresh } = useRouter()
    const isPublished = news.visibility.published

    return (
        <div className={styles.NewsPublishControls}>
            <div className={styles.status}>
                <h4>Status:</h4>
                <span className={`${styles.statusIndicator} ${isPublished ? styles.published : styles.draft}`}>
                    {isPublished ? 'Publisert' : 'Utkast'}
                </span>
            </div>

            <div className={styles.controls}>
                <Form
                    action={publishNewsAction.bind(null, news.id, !isPublished)}
                    submitText={isPublished ? 'Skjul fra nyheter' : 'Publiser nyhet'}
                    submitColor={isPublished ? 'orange' : 'green'}
                    confirmation={isPublished ? {
                        confirm: true,
                        text: 'Er du sikker på at du vil skjule denne nyheten? Den vil ikke lenger være synlig for brukere.'
                    } : undefined}
                    successCallback={() => refresh()}
                >
                </Form>

                <Form
                    action={updateVisibilityAction.bind(null, news.id, !isPublished)}
                    submitText={isPublished ? 'Gjør til utkast' : 'Publiser uten varsling'}
                    submitColor="blue"
                    successCallback={() => refresh()}
                >
                </Form>
            </div>
        </div>
    )
}
