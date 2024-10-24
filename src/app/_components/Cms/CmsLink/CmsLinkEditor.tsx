'use client'
import styles from './CmsLinkEditor.module.scss'
import TextInput from '@/components/UI/TextInput'
import EditOverlay from '@/cms/EditOverlay'
import Form from '@/components/Form/Form'
import { updateCmsLinkAction } from '@/cms/links/update'
import PopUp from '@/components/PopUp/PopUp'
import useEditing from '@/hooks/useEditing'
import type { CmsLinkCollapsed } from '@/services/cms/links/Types'

type PropTypes = {
    cmsLink: CmsLinkCollapsed
}

export default function CmsLinkEditor({ cmsLink }: PropTypes) {
    const canEdit = useEditing({}) //TODO: check visibility of cmsLink for user and pass it to useEditing
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
                <TextInput defaultValue={cmsLink.text} name="text" label="Tekst" />
                <TextInput defaultValue={cmsLink.url} name="url" label="URL" />
            </Form>
        </PopUp>

    )
}
