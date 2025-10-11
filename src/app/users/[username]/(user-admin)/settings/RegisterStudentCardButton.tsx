'use client'
import { registerStudentCardInQueueAction } from '@/services/users/actions'
import { configureAction } from '@/services/configureAction'
import Form from '@/app/_components/Form/Form'
import { studentCardRegistrationExpiry } from '@/services/users/constants'


export default function RegisterStudentCardButton({
    userId,
}: {
    userId: number,
}) {
    return <Form
        action={configureAction(registerStudentCardInQueueAction, { params: { userId } })}
        submitText="Registrer Studentkort"
    >
        <p>
            For å registrere studentkortet til brukeren din trykk på knappen under.
            Deretter skan kortet ditt på skanneren til Koigeskabet på Lophtet, uten at du har lagt inn noen varer enda.
            Fra du trykker på knappen har du { studentCardRegistrationExpiry }
            minutter på deg til å skanne kortet ditt.
        </p>
    </Form>
}
