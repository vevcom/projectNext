import { User as nextAuthUser } from 'next-auth'
import { ExtendedFeideUser } from './Types'
import { upsertManyStudyProgrammes } from '@/actions/studyprogrammes/create'
import { addUserByIdToRoles } from '@/actions/permissions/create'

export default async function signUp({user, profile}: {user: nextAuthUser, profile: ExtendedFeideUser}) {
    console.log('signUp', user, profile)

    const groups = profile.groups.filter(group => {
        return group.type === 'fc:fs:prg' && group.id.split(':')[4] === 'ntnu.no';
    }).map(group => ({
        code: group.id.split(':')[5],
        name: group.displayName,
    }))

    const studyPrograms = await upsertManyStudyProgrammes(groups);
    if (studyPrograms.success) {
        await addUserByIdToRoles(Number(user.id), studyPrograms.data.map(program => program.id))
    }
}