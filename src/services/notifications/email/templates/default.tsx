import '@pn-server-only'

import { Html, Markdown } from '@react-email/components'
import type { UserFiltered } from '@/services/users/Types'

export function DefaultEmailTemplate({
    text,
}: {
    user: UserFiltered,
    text: string,
}) {
    return (
        <Html>
            <Markdown>{text}</Markdown>

            <p style={{ color: '#666' }}>
                Du får denne e-posten siden du står på mailinglistene til Sct. Omega broderskab.
                Dersom du ønsker å avslutte abonommentet trykk <a href="https://www.youtube.com/watch?v=lYBUbBu4W08">her</a>.
            </p>
        </Html>
    )
}
