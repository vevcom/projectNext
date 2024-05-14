import 'server-only'

import { Html } from '@react-email/components'
import type { UserFiltered } from '@/server/users/Types'

export function VerifyEmailTemplate({
    user,
    link,
}: {
    user: UserFiltered,
    link: string,
}) {
    return (
        <Html>
            <h1>Bekreft epost</h1>

            <p>Hei {user.firstname},</p>

            <p>
                Du får denne espoten siden du nettopp registrerte deg hos {process.env.DOMAIN}.
                Vennligst bekreft eposten din ved å trykke på <a href={link}>linken</a>.
            </p>

            <p>Hvis du ikke har registrert deg hos {process.env.DOMAIN} kan du bare se bort i fra denne eposten.</p>

            <p>
                Med vennlig hilsen<br/>
                Vevcom
            </p>
        </Html>
    )
}