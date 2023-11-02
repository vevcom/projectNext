"use client"

import { getCsrfToken } from "next-auth/react"

import { useState } from "react"

function CsrfToken() {
    // getCsrfToken må kjøres på klientsiden fordi den kaller en
    // fetch til serveren for å hente csrf-token. Hvis den kalles
    // på serversiden så vil den returnere serverens sin egen csrf-token.
    
    const [csrfToken, setCsrfToken] = useState("")

    getCsrfToken().then(token => setCsrfToken(token ?? ""))

    return (
        <input type="hidden" name="csrfToken" value={csrfToken} />
    )
}

export default CsrfToken