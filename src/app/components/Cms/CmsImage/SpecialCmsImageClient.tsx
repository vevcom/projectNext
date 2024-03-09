import CmsImageClient from './CmsImageClient'
import { readSpecialCmsImage } from '@/actions/cms/images/read'
import { useEffect, useState } from 'react'
import type { PropTypes } from './SpecialCmsImage'
import type { ExpandedCmsImage } from '@/actions/cms/images/Types'

/**
 * WARNING: This component is only meant for the client - use SpecialCmsImageClient for the server
 * A component that fetches a special cms image and displays it
 * @param special - the special cms image to display
 * @returns
 */
export default function SpecialCmsImageClient({ special, ...props }: PropTypes) {
    const [cmsImage, setCmsImage] = useState<ExpandedCmsImage | null>(null)
    useEffect(() => {
        readSpecialCmsImage(special).then(res => {
            if (!res.success) throw new Error(`No special cms image found for ${special}`)
            setCmsImage(res.data)
        })
    }, [])

    return (
        cmsImage && (
            <CmsImageClient cmsImage={cmsImage} {...props} />
        )
    )
}
