'use client'
import { updateUserAction } from '@/services/users/actions'
import Form from '@/app/_components/Form/Form'
import Checkbox from '@/app/_components/UI/Checkbox'
import { configureAction } from '@/services/configureAction'


export default function RegisterKioleskapLeaderboard({
    userId,
    kioleskapLead,
}: {
    userId: number,
    kioleskapLead: boolean,
}) {
    return <Form
        action={configureAction(updateUserAction, { params: { id: userId } })}
        submitText="Oppdater innstilling over"
    >
        <Checkbox name="kioleskapLead" defaultChecked={kioleskapLead}>Jeg vil vises på Kioleskapets leaderboard</Checkbox>
    </Form>
}
