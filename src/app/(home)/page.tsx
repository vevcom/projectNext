import LoggedInLandingPage from './LoggedIn'
import LoggedOutLandingPage from './LoggedOut'
import { getUser } from '@/auth/getUser'


export default async function Home() {
    const user = await getUser()

    if (!user.user) {
        return <LoggedOutLandingPage />
    }

    return <LoggedInLandingPage />
}
