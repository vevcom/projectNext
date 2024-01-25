'use client'
import styles from './CmsLinkEditor.module.scss'
import Form from '@/components/Form/Form';
import TextInput from '../../UI/TextInput';
import type { CmsLink } from '@prisma/client';
import update from '@/actions/cms/links/update';
import { EditModeContext } from '@/context/EditMode';
import { useContext } from 'react';
import { useRouter } from 'next/navigation'

type PropTypes = {
    cmsLink: CmsLink
}

export default function CmsLinkEditor({ cmsLink }: PropTypes) {
    const editContext = useContext(EditModeContext)
    const { refresh } = useRouter()
    if (!editContext?.editMode) return null

    return (
        <Form 
            className={styles.CmsLinkEditor}
            action={update.bind(null, cmsLink.id)}
            submitText='Chang Link'
            successCallback={refresh}
        >
            <TextInput defaultValue={cmsLink.text} name="text" label="Text" />
            <TextInput defaultValue={cmsLink.url} name="url" label="URL" />
        </Form>
    )
}