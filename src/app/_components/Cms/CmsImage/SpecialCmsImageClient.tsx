'use client'
import CmsImageClient from './CmsImageClient'
import useActionCall from '@/hooks/useActionCall'
import { configureAction } from '@/services/configureAction'
import { useCallback } from 'react'
import type { PropTypes } from './SpecialCmsImage'

/**
 * WARNING: This component is only meant for the client - use SpecialCmsImageClient for the server
 * A component that fetches a special cms image and displays it
 * @param special - the special cms image to display
 * @returns
 */
export default function SpecialCmsImageClient({
    special,
    updateCmsImageAction,
    readSpecialCmsImageAction,
    ...props
}: PropTypes) {
    const action = useCallback(configureAction(
        readSpecialCmsImageAction,
        { params: { special } }
    ), [special])
    const { data: cmsImage, error } = useActionCall(action)
    if (error) throw new Error(`No special cms image found for ${special}`)

    return (
        cmsImage && (
            <CmsImageClient {...props} cmsImage={cmsImage} updateCmsImageAction={updateCmsImageAction} />
        )
    )
}
