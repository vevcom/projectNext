import '@pn-server-only'

import { Html } from '@react-email/components'
import type { UserFiltered } from '@/services/users/Types'

export function UserInvitationTemplate({
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
                Vi startet opprettelsen av en bruker til deg hos {process.env.DOMAIN}.
                For å fullføre registreringen vennligst følge <a href={link}>denne linken</a>.
                Dersom du har problemer med å fullføre registreringen ta kontakt med Vevcom på mail,
                <a href={`mailto:vevcom@${process.env.DOMAIN}`}>vevcom@{process.env.DOMAIN}</a>.
            </p>

            <p>Hvis du ikke har registrert deg hos {process.env.DOMAIN} kan du bare se bort i fra denne e-posten.</p>

            <p>
                Med vennlig hilsen<br/>
                Vevcom
            </p>
        </Html>
    )
}
