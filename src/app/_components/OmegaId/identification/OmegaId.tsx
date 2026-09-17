'use server'

import OmegaIdElement from './OmegaIdElement'
import { generateOmegaIdAction } from '@/services/omegaid/actions'
import { ServerSession } from '@/auth/session/ServerSession'


export default async function OmegaId() {
    const user = (await ServerSession.fromNextAuth()).user
    if (!user) {
        return <p>Failed to load Omega-ID</p>
    }

    const results = await generateOmegaIdAction({ params: { userId: user.id } })

    if (!results.success) {
        return <p>Failed to load Omega-ID</p>
    }

    return <OmegaIdElement token={results.data} />
}
