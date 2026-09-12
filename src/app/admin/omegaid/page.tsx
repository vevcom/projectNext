'use server'

import OmegaIdContainer from './container'
import { readOmegaJWTPublicKeyAction } from '@/services/omegaid/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'


export default async function OmegaId() {
    const publicKey = unwrapActionReturn(await readOmegaJWTPublicKeyAction())

    return <OmegaIdContainer publicKey={publicKey} />
}
