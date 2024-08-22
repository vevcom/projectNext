'use client'
import OmegaIdReader from '@/app/components/OmegaId/reader/OmegaIdReader'


export default function OmegaIdContainer({
    publicKey,
}: {
    publicKey: string,
}) {
    return <OmegaIdReader
        publicKey={publicKey}
        successCallback={async (user) => ({
            success: true,
            text: `${user.firstname} ${user.lastname}`,
        })}
    />
}
