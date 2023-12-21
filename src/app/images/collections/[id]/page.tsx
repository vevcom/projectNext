import React from 'react'

type PropTypes = {
    params: {
        id: string
    }
}

export default function Collection({ params } : PropTypes) {
    return (
        <div>collection {params.id}</div>
    )
}
