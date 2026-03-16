import Knapper from './Knapper'
import { readUsersOfGroupsAction } from '@/services/groups/actions'
import { readUserProfileAction } from '@/services/users/actions'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { notFound } from 'next/navigation'

//
type PropTypes = {
    params: Promise<{
        groupId: string,
        order: string
    }>,
}

export default async function navnquiz({ params }: PropTypes) {
    const groupId = Number((await params).groupId)

    const users = await readUsersOfGroupsAction({
        params: {
            groups: [{
                groupId,
                admin: false,
            }]
        }
    })

    if (users.success === false) {
        notFound()
    }

    const profileImages = await Promise.all(users.data.map(async user => {
        const profile = await readUserProfileAction({
            params: {
                username: user.username,
            }
        })

        if (profile.success === false) {
            notFound()
        }

        return profile.data.user.image
    }))


    return <PageWrapper title="Navnquiz">
        <Knapper users={users.data} profileImages={profileImages}></Knapper>
    </PageWrapper>
}
