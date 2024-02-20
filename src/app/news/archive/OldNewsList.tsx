'use client'

import { ReactNode } from 'react'

type PropTypes = {
    serverRendered: ReactNode
}

export default function OldNewsList({ serverRendered }: PropTypes) {
    return (
        <div>
            {serverRendered}
        </div>
    )
}
