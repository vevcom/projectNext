import { getCommitee } from '@/app/committees/[name]/page'
import CmsImage from '@/app/components/Cms/CmsImage/CmsImage'
import type { PropTypes } from '@/app/committees/[name]/page'


export default async function ComitteeAdmin({ params }: PropTypes) {
    const committee = await getCommitee(params)
    return (
        <div>
            <h1>Admin for {committee.name}</h1>
            <CmsImage cmsImage={committee.logoImage} width={300} />
        </div>
    )
}
