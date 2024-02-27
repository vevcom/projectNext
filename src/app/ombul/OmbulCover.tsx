import styles from './OmbulCover.module.scss'
import { ExpandedOmbul } from "@/actions/ombul/Types"
import CmsImage from '../components/Cms/CmsImage/CmsImage'

type PropTypes = {
    ombul: ExpandedOmbul
}

export default function OmbulCover({ ombul } : PropTypes) {
    return (
        <div className={styles.OmbulCover}>
            <CmsImage name={ombul.coverImage.name} width={200} />
            <h5>{ombul.year} - {ombul.issueNumber}</h5>
            <h2>{ombul.name}</h2>
            <p>{ombul.description}</p>
        </div>
    )
}
