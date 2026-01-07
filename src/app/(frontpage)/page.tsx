import LoggedInLandingPage from './LoggedIn'
import LoggedOutLandingPage from './LoggedOut'
import { ServerSession } from '@/auth/session/ServerSession'

export default async function Home() {
    const { user } = await ServerSession.fromNextAuth()
    return user ? <LoggedInLandingPage/> : <LoggedOutLandingPage />
}
