import Form from '@/app/components/Form/Form'
import styles from './SideBar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt } from '@fortawesome/free-solid-svg-icons'
import PopUp from '@/app/components/PopUp/PopUp'
import Textarea from '@/app/components/UI/Textarea'
import TextInput from '@/app/components/UI/TextInput'
import { ReturnType } from '@/actions/cms/articleCategories/ReturnType'
import { updateArticleCategory } from '@/actions/cms/articleCategories/update'

type PropTypes = {
    category: ReturnType
}

export default function EditCategory({ category }: PropTypes) {
    //TODO: check if user has edit visibility
    const canEditArticle = true

    return (
        canEditArticle && (
            <PopUp
                PopUpKey="editCategory"
                showButtonContent={
                    <FontAwesomeIcon icon={faBolt} />
                }
            >
                <Form
                    className={styles.EditCategory}
                    action={updateArticleCategory.bind(null, category.id)}
                >
                    <TextInput label="navn" name="name" defaultValue={"hei"} />
                    <Textarea 
                        label="beskrivelse" 
                        name="description" 
                        defaultValue={"hei"} 
                        className={styles.description}
                    />
                </Form>
            </PopUp>
        )
    )
}
