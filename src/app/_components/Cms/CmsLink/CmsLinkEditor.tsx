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
import { CmsLinkType } from '@prisma/client'
import { SelectString } from '@/UI/Select'
import { CmsLinkTypeOptions } from '@/services/cms/links/ConfigVars'

type PropTypes = {
    cmsLink: CmsLinkInfered
}

export default function CmsLinkEditor({ cmsLink }: PropTypes) {
    const canEdit = useEditing({}) //TODO: check visibility of cmsLink for user and pass it to useEditing
    const [type, setType] = useState<CmsLinkType>(cmsLink.type)
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
                <SelectString
                    name='type'
                    onChange={val => setType(Object.values(CmsLinkType).find(v => v === val) || 'RAW_URL')}
                    options={CmsLinkTypeOptions}
                    defaultValue={cmsLink.type}
                    value={type}
                />
                <CmsLinkEditorContent type={type} cmsLink={cmsLink} />
            </Form>
        </PopUp>

    )
}

function CmsLinkEditorContent({ type, cmsLink }: PropTypes & { type: CmsLinkType }) {
    switch (type) {
        case 'RAW_URL':
            return (
            <>
                <TextInput defaultValue={cmsLink.text} name="rawUrlText" label="Tekst" />
                <TextInput defaultValue={cmsLink.url} name="rawUrl" label="URL" />
            </>
            )
        case 'NEWS':
            return (
            <>
                
            </>
            )
        case 'ARTICLE_CATEGORY_ARTICLE':
            return (
            <>
            </>   
            )
        case 'IMAGE_COLLECTION':
            return (
            <>
            </>
            )
        default:
            return <></>
    }
}
