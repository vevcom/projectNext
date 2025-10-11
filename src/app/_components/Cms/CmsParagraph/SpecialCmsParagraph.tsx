import CmsParagraph from './CmsParagraph'
import { readSpecialCmsParagraphAction } from '@/services/cms/paragraphs/actions'
import React from 'react'
import type { PropTypes as PropTypesCmsParapraph } from './CmsParagraph'
import type { SpecialCmsParagraph as SpecialCmsParagraphT } from '@prisma/client'

type PropTypes = Omit<PropTypesCmsParapraph, 'cmsParagraph'> & {
    special: SpecialCmsParagraphT
}

/**
 * WARNING: This component should only be rendered server side, on client fetch the
 * paragraph using readSpecialCmsParagraphAction
 *
 * then render it using CmsParagraph.
 * A component that reads a special type of paragraph using readSpecialCmsParagraphAction
 * then renders it using standard CmsParagraph
 * @param special - the special type of the paragraph to read
 * @returns
 */
export default async function SpecialCmsParagraph({ special, ...props }: PropTypes) {
    const res = await readSpecialCmsParagraphAction(special)
    if (!res.success) return <i>Error: {res.error && res.error[0].message}</i>

    return (
        <CmsParagraph cmsParagraph={res.data} {...props} />
    )
}
