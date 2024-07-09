'use server'

import OmegaIdContainer from './container'
import { readOmegaJWTPublicKey } from '@/actions/omegaid/read'


export default async function OmegaId() {
    const publicKey = await readOmegaJWTPublicKey()

    return <OmegaIdContainer publicKey={publicKey} />
}
