'use client'

import { getCsrfToken } from 'next-auth/react'

async function CsrfToken() {
    // getCsrfToken må kjøres på klientsiden*
    // ellers så spytter den ut tilfedlig tokens
    //
    // * må og må, det finnes nok en bedre
    // løsning men dette var den enkelste
    const csrfToken = await getCsrfToken()

    return (
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
    )
}

export default CsrfToken
