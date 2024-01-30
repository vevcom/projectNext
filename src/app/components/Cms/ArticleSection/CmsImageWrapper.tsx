'use client'
import useViewPort from '@/hooks/useViewPort';
import { useRef } from 'react';

/**
 * 
 * This component is used to wrap the image in the article section only to  make sure the
 * layout is correct depending on viewport size 
 * This is needed because we need client side rendering to get the viewport size
 */

type PropTypes = {
    children: React.ReactNode
    className?: string
    idParagraph: string
    idMoveControls: string
}

export default function CmsImageWrapper({ children, className, idParagraph, idMoveControls }: PropTypes) {
    const ref = useRef<HTMLSpanElement>(null)
    useViewPort(() => {
        const imageY = ref.current?.getBoundingClientRect().top;
        const paragraphY = document.getElementById(idParagraph)?.getBoundingClientRect().top;
        if (imageY !== paragraphY) {
            ref.current?.style.setProperty('order', '2')
            document.getElementById(idMoveControls)?.style.setProperty('display', 'none')
        } else {
            ref.current?.style.setProperty('order', null)
            document.getElementById(idMoveControls)?.style.setProperty('display', null)
        }
    })

    return (
        <span className={className} ref={ref}>
            {children}
        </span>
    )
}
