import '@pn-server-only'

import { Html } from '@react-email/components'
import type { UserFiltered } from '@/services/users/Types'

export function VerifyEmailTemplate({
    user,
    link,
}: {
    user: UserFiltered,
    link: string,
}) {
    return (
        <Html>
            <p>Hei {user.firstname},</p>

            <p>
                Du får denne e-posten siden du nettopp registrerte deg hos {process.env.DOMAIN}.
                Vennligst bekreft e-posten din ved å trykke på <a href={link}>linken</a>.
            </p>

            <p>Hvis du ikke har registrert deg hos {process.env.DOMAIN} kan du bare se bort i fra denne e-posten.</p>

            <p>
                Med vennlig hilsen<br/>
                Vevcom
            </p>
        </Html>
    )
}
