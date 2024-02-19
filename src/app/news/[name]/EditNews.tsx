'use client'
import { EditModeContext } from "@/context/EditMode"
import { useContext } from "react"
import styles from './EditNews.module.scss'
import Form from '@/components/Form/Form'
import { publishNews, updateNews, updateVisibility } from '@/actions/news/update'
import { destroyNews } from "@/actions/news/destroy"
import type { ReturnType } from '@/actions/news/ReturnType'
import { useRouter } from "next/navigation"
import TextInput from '@/components/UI/TextInput'
import Textarea from '@/components/UI/Textarea'

type PropTypes = {
    news: ReturnType
}

export default function EditNews({ news }: PropTypes) {
    const editModeCtx = useContext(EditModeContext)
    const { refresh, push } = useRouter()
    //TODO: chack visibility
    const canEdit = true //temp
    if (!editModeCtx?.editMode) return null

    //TODO: add publish functionality with visibility
    const isPublished = false //temp

    const publishAction = publishNews.bind(null, news.id).bind(null, true)
    const unpublishAction = publishNews.bind(null, news.id).bind(null, false)
    const updateAction = updateNews.bind(null, news.id)
    const updateVisibilityAction = updateVisibility.bind(null, news.id).bind(null, true)


    return (
        <div className={styles.EditNews}>
            <div className={styles.update}>
                <Form
                    action={updateAction}
                    successCallback={(data) => {
                        push(`/news/${data?.articleName}`)
                    }}
                    submitText="oppdater"
                >
                    <TextInput color="white" defaultValue={news.articleName} label="navn" name="name" />
                    <Textarea defaultValue={news.description || ''} label="beskrivelse" name="description" />
                </Form>
                <Form
                    action={destroyNews.bind(null, news.id)}
                    successCallback={() => {
                        push('/news')
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
                <Form
                    action={updateVisibilityAction}
                    submitText="oppdater synlighet"

                >

                </Form>
            </div>

            <div className={styles.publish}>
                {
                    isPublished ? (
                    <>
                        <p>Denne nyheten er publisert</p>
                        <Form
                            action={unpublishAction}
                            successCallback={refresh}
                            submitText="avpubliser"
                        />
                    </> 
                    ) : (
                    <>
                        <p>Denne nyheten er ikke publisert enda</p>
                        <Form
                            action={publishAction}
                            successCallback={refresh}
                            submitText="publiser"
                        />
                    </>
                    )
                    
                }
            </div>
        </div>
    )
}
