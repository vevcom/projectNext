import 'server-only'

import { Html } from '@react-email/components'
import type { UserFiltered } from '@/services/users/Types'

export function ResetPasswordTemplate({
    user,
    link,
}: {
    user: UserFiltered,
    link: string,
}) {
    return (
        <Html>
            <h1>Glemt passord</h1>

            <p>Hei {user.firstname},</p>

            <p>
                Du får denne epsoten siden du har trykket på glemt passord.
                Trykk på denne <a href={link}>lenken</a> for å null stille passordet.
                Lenken blir ugyldig etter 15 minutter.
            </p>

            <p>Hvis du ikke har trykket på glemt passord knappen kan du bare se bort i fra denne e-posten.</p>

            <p>
                Med vennlig hilsen<br/>
                Vevcom
            </p>
        </Html>
    )
}
