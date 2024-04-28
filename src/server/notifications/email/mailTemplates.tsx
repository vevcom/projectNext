import 'server-only'

import { Html, Markdown } from '@react-email/components';
import { UserFiltered } from '@/server/users/Types';

export function DefaultEmailTemplate({
    user,
    text,
}: {
    user: UserFiltered,
    text: string,
}) {

    return (
        <Html>
            <Markdown>{text}</Markdown>

            <p style={{color: "#AAA"}}>
                Du får dene eposten siden du står på mailinglistene til Sct. Omega broderskab.
                Dersom du ønsker å avslutte abonommentet trykk <a href="https://www.youtube.com/watch?v=lYBUbBu4W08">her</a>.
            </p>
        </Html>
    )
}