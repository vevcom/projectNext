import Image from '@/components/Image/Image'
import styles from './OmbulCover.module.scss'
import { ExpandedOmbul } from "@/actions/ombul/Types"

type PropTypes = {
    ombul: ExpandedOmbul
}

export default function OmbulCover({ ombul } : PropTypes) {
    return (
        <div className={styles.OmbulCover}>
            {ombul.name}
        </div>
    )
}
