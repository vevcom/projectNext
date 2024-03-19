import CmsImage from './CmsImage'
import { readSpecialCmsImage } from '@/actions/cms/images/read'
import type { SpecialCmsImage as SpecialCmsImageT } from '@prisma/client'
import type { PropTypes as CmsImageProps } from './CmsImage'

export type PropTypes = Omit<CmsImageProps, 'cmsImage'> & {
    special: SpecialCmsImageT
}
/**
 * WARNING: This component is only meant for the server - use SpecialCmsImageClient for the client
 * A component that fetches a special cms image and displays it
 * @param special - the special cms image to display
 * @returns
 */
export default async function SpecialCmsImage({ special, ...props }: PropTypes) {
    const imageRes = await readSpecialCmsImage(special)
    if (!imageRes.success) throw new Error(`No special cms image found for ${special}`)
    const cmsImage = imageRes.data

    return (
        <CmsImage cmsImage={cmsImage} {...props} />
    )
}
