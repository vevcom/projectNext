import { notFound } from 'next/navigation'
import { readCommitee } from '@/actions/groups/committees/read'
import type { PropTypes } from './page'

export default async function getCommitee(params: PropTypes['params']) {
    const name = decodeURIComponent(params.name)
    const res = await readCommitee(name)
    if (!res.success) notFound()
    return res.data
}
