'use client'
import { configureAction } from '@/actions/configureAction'
import { registerStudentCardInQueueAction } from '@/actions/users/update'
import Form from '@/app/_components/Form/Form'
import { UserConfig } from '@/services/users/config'


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
            Fra du trykker på knappen har du { UserConfig.studentCardRegistrationExpiry }
            minutter på deg til å skanne kortet ditt.
        </p>
    </Form>
}
