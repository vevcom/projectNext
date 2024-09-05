import getCommittee from '@/app/committees/[name]/getCommittee'
import CmsImage from '@/components/Cms/CmsImage/CmsImage'
import type { PropTypes } from '@/app/committees/[name]/page'
import PageWrapper from '@/components/PageWrapper/PageWrapper'


export default async function ComitteeAdmin({ params }: PropTypes) {
    const committee = await getCommittee(params)
    return (
        <PageWrapper title={committee.name}>
        <div>
            <p>Admin for {committee.name}</p>
            {
                //TODO: make sure this cms image can only chose images with cirtain permission (
                // can view committees, should be same permission as COMMITTEELOGOS)
            }
        </div>
        <CmsImage cmsImage={committee.logoImage} width={300} />
        </PageWrapper>
    )
}
