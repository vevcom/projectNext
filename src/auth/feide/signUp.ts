import 'server-only'
import { upsertStudyProgrammes } from '@/server/groups/studyProgrammes/create'
import { addMemberToGroups } from '@/server/groups/update'
import { updateEmailForFeideAccount } from '@/server/auth/feide/update'
import type { User as nextAuthUser } from 'next-auth'
import type { ExtendedFeideUser } from './Types'

export default async function signUp({ user, profile }: {user: nextAuthUser, profile: ExtendedFeideUser}) {
    const groups = profile.groups
        .filter(group => group.type === 'fc:fs:prg' && group.id.split(':')[4] === 'ntnu.no')
        .map(group => ({
            code: group.id.split(':')[5],
            name: group.displayName,
        })
        )

    const updatedEmail = updateEmailForFeideAccount(profile.sub, profile.email)

    const studyProgrammes = await upsertStudyProgrammes(groups)
    await addMemberToGroups(Number(user.id), studyProgrammes.map(programme => ({ groupId: programme.id, admin: false })))

    await updatedEmail
}
