import LoggedInLandingPage from './LoggedIn'
import LoggedOutLandingPage from './LoggedOut'
import { Session } from '@/auth/Session'

export default async function Home() {
    const { user } = await Session.fromNextAuth()
    return user ? <LoggedInLandingPage/> : <LoggedOutLandingPage />
}
