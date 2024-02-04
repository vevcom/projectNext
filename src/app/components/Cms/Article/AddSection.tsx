import AddParts from '@/cms/AddParts'
import styles from './AddSection.module.scss'
import type { Part } from '@/cms/articleSections/update'
import { useRouter } from 'next/navigation'

export default function AddSection() {
    const { refresh } = useRouter()

    const handleAdd = async (part: Part) => {
        refresh()
    }
    return (
        <span className={styles.AddSection}>
            <AddParts 
                showParagraphAdd={true}
                showImageAdd={true}
                showLinkAdd={true}
                onClick={handleAdd}
            />
        </span>
    )
}
