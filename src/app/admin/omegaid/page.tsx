'use server'

import OmegaIdContainer from './container'
import { readOmegaJWTPublicKey } from '@/services/omegaid/actions'


export default async function OmegaId() {
    const publicKey = await readOmegaJWTPublicKey()

    return <OmegaIdContainer publicKey={publicKey} />
}
