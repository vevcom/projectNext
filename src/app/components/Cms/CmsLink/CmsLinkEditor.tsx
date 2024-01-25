import styles from './CmsLinkEditor.module.scss'
import Form from '@/components/Form/Form';
import TextInput from '../../UI/TextInput';


export default function CmsLinkEditor() {
    return (
        <Form 
            action={}
        >
            <TextInput name="text" label="Text" />
            <TextInput name="url" label="URL" />
        </Form>
    )
}