import styles from './OmbulCover.module.scss'
import { ExpandedOmbul } from "@/actions/ombul/Types"
import CmsImage from '../components/Cms/CmsImage/CmsImage'

type PropTypes = {
    ombul: ExpandedOmbul
}

export default function OmbulCover({ ombul } : PropTypes) {
    return (
        <div className={styles.OmbulCover}>
            {ombul.name}
            <CmsImage name={ombul.coverImage.name} width={200} />
        </div>
    )
}
