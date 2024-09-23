import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import EventsLandingLayout from '../EventsLandingLayout'

export default async function EventArchive() {
    return (
        <EventsLandingLayout title="Hvad Der Har Hendt" headerLinks={[
            {
                href: '/events',
                icon: faArrowLeft
            }
        ]} headerItem={<></>}>
            <></>
        </EventsLandingLayout>
    )
}