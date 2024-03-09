import 'server-only'
import { updateEmailForFeideAccount } from '.'
import { upsertManyStudyProgrammes } from '@/actions/studyprogrammes/create'
import { addUserByIdToRoles } from '@/actions/permissions/create'
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

    const studyPrograms = await upsertManyStudyProgrammes(groups)
    if (studyPrograms.success) {
        await addUserByIdToRoles(Number(user.id), studyPrograms.data.map(program => program.id))
    }

    await updatedEmail
}
