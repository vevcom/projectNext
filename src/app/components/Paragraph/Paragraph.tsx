import type { Paragraph } from '@prisma/client'
import React from 'react'

type PropTypes = {
    paragraph: Paragraph | null
}

export default async function Paragraph({paragraph}: PropTypes) {

    return (
        <div>{paragraph ? paragraph.content : <i>no content</i>}</div>
    )
}
