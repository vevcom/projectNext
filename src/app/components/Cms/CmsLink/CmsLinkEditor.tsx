import styles from './CmsLinkEditor.module.scss'
import Form from '@/components/Form/Form';
import TextInput from '../../UI/TextInput';
import type { CmsLink } from '@prisma/client';
import update from '@/actions/cms/links/update';

type PropTypes = {
    cmsLink: CmsLink
}

export default function CmsLinkEditor({ cmsLink }: PropTypes) {
    return (
        <Form 
            className={styles.CmsLinkEditor}
            action={update.bind(null, cmsLink.id)}
        >
            <TextInput name="text" label="Text" />
            <TextInput name="url" label="URL" />
        </Form>
    )
}