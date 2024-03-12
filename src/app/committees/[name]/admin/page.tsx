import getCommittee from '@/app/committees/[name]/getCommittee'
import CmsImage from '@/app/components/Cms/CmsImage/CmsImage'
import type { PropTypes } from '@/app/committees/[name]/page'


export default async function ComitteeAdmin({ params }: PropTypes) {
    const committee = await getCommittee(params)
    return (
        <div>
            <h1>Admin for {committee.name}</h1>
            {
                //TODO: make sure this cms image can only chose images with cirtain permission (
                // can view committees, should be same permission as COMMITTEELOGOS)
            }
            <CmsImage cmsImage={committee.logoImage} width={300} />
        </div>
    )
}
