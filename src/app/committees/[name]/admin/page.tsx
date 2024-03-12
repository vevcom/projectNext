import type { PropTypes } from "@/app/committees/[name]/page";
import { getCommitee } from "@/app/committees/[name]/page";
import CmsImage from "@/app/components/Cms/CmsImage/CmsImage";


export default async function ComitteeAdmin({ params }: PropTypes) {
    const committee = await getCommitee(params)
    return (
        <div>
            <h1>Admin for {committee.name}</h1>
            <CmsImage cmsImage={committee.logoImage} width={300} />
        </div>
    )
}