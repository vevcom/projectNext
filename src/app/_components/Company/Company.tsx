import { CompanyExpanded } from "@/services/career/companies/Types"
import CmsImage from "@/cms/CmsImage/CmsImage"
import CmsImageClient from "@/cms/CmsImage/CmsImageClient"
import styles from './Company.module.scss'

type PropTypes = {
    company: CompanyExpanded,
    asClient: boolean
}

export default function Company({ company, asClient }: PropTypes) {
    return (
        <div className={styles.Company}>
            { asClient ? 
                <CmsImageClient className={styles.logo} cmsImage={company.logo} width={300} /> : 
                <CmsImage className={styles.logo} cmsImage={company.logo} width={300} />
            }
            <h2>{company.name}</h2>
            <p>{company.description}</p>
        </div>
    )
}
