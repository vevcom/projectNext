'use server'

import OmegaIdElement from './OmegaIdElement'
import { generateOmegaIdAction } from '@/services/omegaid/actions'


export default async function OmegaId() {
    const results = await generateOmegaIdAction()

    if (!results.success) {
        return <p>Failed to load OmegaId</p>
    }

    return <OmegaIdElement token={results.data} />
}
