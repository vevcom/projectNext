import React from 'react'

type PropTypes = {
    collectionId: number,
    startImageId: number,
}

export default function ImageCollectionDisplay({collectionId, startImageId}: PropTypes) {
    return (
        <div>{collectionId + startImageId}</div>
    )
}
