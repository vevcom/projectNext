import React from 'react'
import CmsParagraph, { PropTypes as PropTypesCmsParapraph } from './CmsParagraph'
import { readSpecialCmsParagraph } from '@/actions/cms/paragraphs/read'
import { SpecialCmsParagraph as SpecialCmsParagraphT } from '@prisma/client'

type PropTypes = Omit<PropTypesCmsParapraph, 'cmsParagraph'> & {
    special: SpecialCmsParagraphT
}

export default async function SpecialCmsParagraph({ special, ...props }: PropTypes) {
    const res = await readSpecialCmsParagraph(special)
    if (!res.success) return <i>Error: {res.error && res.error[0].message}</i>

    return (
        <CmsParagraph cmsParagraph={res.data} {...props} />
    )
}
