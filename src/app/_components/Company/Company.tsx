import { CompanyExpanded } from "@/services/career/companies/Types"
import CmsImage from "../Cms/CmsImage/CmsImage"
import CmsImageClient from "../Cms/CmsImage/CmsImageClient"

type PropTypes = {
    company: CompanyExpanded,
    asClient: boolean
}

export default function Company({ company, asClient }: PropTypes) {
    return (
        <div>
            <h2>{company.name}</h2>
            <p>{company.description}</p>
            { asClient ? 
                <CmsImageClient cmsImage={company.logo} width={300} /> : 
                <CmsImage cmsImage={company.logo} width={300} />
            }
        </div>
    )
}
