'use server'

import OmegaIdContainer from './container'
import { readOmegaIdPublicKey } from '@/actions/omegaid/read'


export default async function OmegaId() {
    const publicKey = await readOmegaIdPublicKey()

    return <OmegaIdContainer publicKey={publicKey} />
}
