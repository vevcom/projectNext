import styles from './CmsLinkEditor.module.scss'
import Form from '@/components/Form/Form';
import TextInput from '../../UI/TextInput';
import type { CmsLink } from '@prisma/client';

type PropTypes = {
    cmsLink: CmsLink
}

export default function CmsLinkEditor({ cmsLink }: PropTypes) {
    return (
        <Form 
            className={styles.CmsLinkEditor}
            action={}
        >
            <TextInput name="text" label="Text" />
            <TextInput name="url" label="URL" />
        </Form>
    )
}