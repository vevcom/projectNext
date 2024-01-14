import type { Paragraph } from '@prisma/client'
import React from 'react'

type PropTypes = {
    paragraph: Paragraph
}

export default async function Paragraph({paragraph}: PropTypes) {
    return (
        <div>{paragraph.content ? paragraph.content : <i>no content</i>}</div>
    )
}
