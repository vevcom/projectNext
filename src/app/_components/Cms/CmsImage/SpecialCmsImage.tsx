import CmsImage from './CmsImage'
import type { SpecialCmsImage as SpecialCmsImageT } from '@prisma/client'
import type { PropTypes as CmsImageProps } from './CmsImage'
import type { ReadSpecialCmsImageAction } from '@/cms/images/types'
import { configureAction } from '@/services/configureAction'

export type PropTypes = Omit<CmsImageProps, 'cmsImage'> & {
    special: SpecialCmsImageT,
    readSpecialCmsImageAction: ReadSpecialCmsImageAction
}
/**
 * WARNING: This component is only meant for the server - use SpecialCmsImageClient for the client
 * A component that fetches a special cms image and displays it
 * @param special - the special cms image to display
 * @returns
 */
export default async function SpecialCmsImage({ special, readSpecialCmsImageAction, ...props }: PropTypes) {
    const imageRes = await configureAction(readSpecialCmsImageAction, { params: { special } })()
    if (!imageRes.success) throw new Error(`No special cms image found for ${special}`)
    const cmsImage = imageRes.data

    return (
        <CmsImage cmsImage={cmsImage} {...props} />
    )
}
