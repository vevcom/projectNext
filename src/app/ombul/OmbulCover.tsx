import styles from './OmbulCover.module.scss'
import { ExpandedOmbul } from "@/actions/ombul/Types"
import CmsImage from '../components/Cms/CmsImage/CmsImage'

type PropTypes = {
    ombul: ExpandedOmbul
}

export default function OmbulCover({ ombul } : PropTypes) {
    return (
        <div className={styles.OmbulCover}>
            <div className={styles.coverImg}>
                <CmsImage name={ombul.coverImage.name} width={200} />
            </div>
            <h2>{ombul.name}</h2>
            <h5>{ombul.year} - {ombul.issueNumber}</h5>
            <p>{ombul.description}</p>
        </div>
    )
}
