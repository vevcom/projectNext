import styles from './OmbulCover.module.scss'
import { ExpandedOmbul } from "@/actions/ombul/Types"
import CmsImage from '../components/Cms/CmsImage/CmsImage'
import CmsImageClient from '../components/Cms/CmsImage/CmsImageClient'

export type PropTypesPreview = {
    pImage: File | null,
    pName: string,
    pYear: string,
    pIssueNumber: string,
    pDescription: string
}

type PropTypes = {
    client?: boolean
}
& ({
    ombul: ExpandedOmbul
} | {
    ombul: null
    preview: PropTypesPreview
})

export default function OmbulCover({ client = false,...props } : PropTypes) {
    const name = props.ombul ? props.ombul.name : props.preview.pName
    const year = props.ombul ? props.ombul.year : props.preview.pYear
    const issueNumber = props.ombul ? props.ombul.issueNumber : props.preview.pIssueNumber
    const description = props.ombul ? props.ombul.description : props.preview.pDescription
    const coverImage = props.ombul ? props.ombul.coverImage : props.preview.pImage

    return (
        <div className={styles.OmbulCover}>
            <div className={styles.coverImg}>
                {
                    typeof coverImage === 'string' ? (
                        <img src={coverImage} alt="cover" />
                    ) : (
                        client ? (
                            <CmsImageClient name={coverImage?.name || ''} width={200} />
                        ) : (
                            <CmsImage name={coverImage?.name || ''} width={200} />
                        )
                    )
                }
            </div>
            <h2>{name}</h2>
            <h5>{year} - {issueNumber}</h5>
            <p>{description}</p>
        </div>
    )
}
