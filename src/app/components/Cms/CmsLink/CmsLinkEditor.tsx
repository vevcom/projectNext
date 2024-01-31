'use client'
import styles from './CmsLinkEditor.module.scss'
import TextInput from '../../UI/TextInput'
import EditOverlay from '../EditOverlay'
import Form from '@/components/Form/Form'
import update from '@/actions/cms/links/update'
import { EditModeContext } from '@/context/EditMode'
import PopUp from '@/components/PopUp/PopUp'
import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import type { CmsLink } from '@prisma/client'

type PropTypes = {
    cmsLink: CmsLink
}

export default function CmsLinkEditor({ cmsLink }: PropTypes) {
    const editContext = useContext(EditModeContext)
    const { refresh } = useRouter()
    if (!editContext?.editMode) return null

    return (
        <PopUp
            PopUpKey={cmsLink.id}
            showButtonClass={styles.openBtn}
            showButtonContent={
                <EditOverlay />
            }>
            <Form
                className={styles.CmsLinkEditor}
                action={update.bind(null, cmsLink.id)}
                submitText="Endre Lenke"
                successCallback={refresh}
            >
                <TextInput defaultValue={cmsLink.text} name="text" label="Tekst" />
                <TextInput defaultValue={cmsLink.url} name="url" label="URL" />
            </Form>
        </PopUp>

    )
}
