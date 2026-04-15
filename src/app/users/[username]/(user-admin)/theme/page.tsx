import { readUserProfileAction } from '@/services/users/actions'
import ThemeForm from '@/app/users/[username]/(user-admin)/theme/ThemeForm'
import { notFound } from 'next/navigation'
import type { PropTypes } from '@/app/users/[username]/page'

export default async function UserSettings({ params }: PropTypes) {
    const profileRes = await readUserProfileAction({ params: { username: (await params).username } })
    if (!profileRes.success) return notFound()
    return (
        <ThemeForm></ThemeForm>
    )
}
