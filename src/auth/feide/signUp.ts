import { User as nextAuthUser } from 'next-auth'
import { ExtendedFeideUser } from './Types'

export default async function signUp({user, profile}: {user: nextAuthUser, profile: ExtendedFeideUser}) {
    console.log('signUp', user, profile)

    
}