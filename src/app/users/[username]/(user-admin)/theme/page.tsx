import styles from './page.module.scss'
import { readUserProfileAction } from '@/services/users/actions'
import { notFound } from 'next/navigation'
import type { PropTypes } from '@/app/users/[username]/page'
import ThemeForm from '@/app/users/[username]/(user-admin)/theme/ThemeForm'

export default async function UserSettings({ params }: PropTypes) {
    const profileRes = await readUserProfileAction({ params: { username: (await params).username } })

    if (!profileRes.success) return notFound()

    return (
        <ThemeForm />
    )
}
