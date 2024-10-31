'use client'
import styles from './CmsLinkEditor.module.scss'
import TextInput from '@/components/UI/TextInput'
import EditOverlay from '@/cms/EditOverlay'
import Form from '@/components/Form/Form'
import { updateCmsLinkAction } from '@/cms/links/update'
import PopUp from '@/components/PopUp/PopUp'
import useEditing from '@/hooks/useEditing'
import type { CmsLinkInfered } from '@/services/cms/links/Types'
import { useState } from 'react'
import type { CmsLinkType } from '@prisma/client'

type PropTypes = {
    cmsLink: CmsLinkInfered
}

export default function CmsLinkEditor({ cmsLink }: PropTypes) {
    const canEdit = useEditing({}) //TODO: check visibility of cmsLink for user and pass it to useEditing
    const type = useState<CmsLinkType>(cmsLink.type)
    if (!canEdit) return null

    return (
        <PopUp
            PopUpKey={cmsLink.id}
            showButtonClass={styles.openBtn}
            showButtonContent={
                <EditOverlay />
            }>
            <Form
                className={styles.CmsLinkEditor}
                action={updateCmsLinkAction.bind(null, { id: cmsLink.id })}
                submitText="Endre Lenke"
                refreshOnSuccess
            >
                <TextInput defaultValue={cmsLink.text} name="rawUrlText" label="Tekst" />
                <TextInput defaultValue={cmsLink.url} name="rawUrl" label="URL" />
            </Form>
        </PopUp>

    )
}
