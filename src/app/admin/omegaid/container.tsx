'use client'
import OmegaIdReader from '@/components/OmegaId/reader/OmegaIdReader'


export default function OmegaIdContainer({
    publicKey,
}: {
    publicKey: string,
}) {
    return <OmegaIdReader
        publicKey={publicKey}
        successCallback={async (userId) => ({
            success: true,
            text: `userID: ${userId}`,
        })}
    />
}
