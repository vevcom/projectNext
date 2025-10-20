import { notFound } from 'next/navigation'
import styles from './page.module.scss'
import { readUsersOfGroupsAction } from '@/services/groups/actions'
import { prisma } from '@/prisma/client'
import { readUserProfileAction } from '@/services/users/actions'
import ProfilePicture from '@/components/User/ProfilePicture'

export type PropTypes = {
    params: Promise<{
        groupId: string,
        order: string
    }>,
}

export default async function navnquiz({ params }: PropTypes) {
    const groupId = Number((await params).groupId)

    const users = await readUsersOfGroupsAction({
        params:{
           groups:[{
            groupId: groupId,
            admin:false,
           }
            
           ] 
        }
    })

    if (users.success==false){
        notFound()
    }

    const profileImages = await Promise.all(users.data.map(async user => {
        const profile = await readUserProfileAction({
            params: {
                username: "harambe",
            }
        })

        if (profile.success==false){
            notFound()
        }

        return profile.data.user.image
    }))


    return (
    <div>
    <h1>Navnquiz</h1>
    {users.data.map((user, i)=><div>
        <p>{user.firstname} {user.lastname}</p>
        <ProfilePicture width={100} profileImage={profileImages[i]} />
    </div>)}
    <p>---</p>
    
    </div>

    )
}