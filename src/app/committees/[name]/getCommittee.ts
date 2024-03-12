import { readCommitee } from '@/actions/groups/committees/read'
import { notFound } from 'next/navigation'
import type { PropTypes } from './page'

/**
 * A function to get a committee from params in a page under /committees/[name]
 * @param params - The name in an object resived by the page
 * @returns
 */
export default async function getCommitee(params: PropTypes['params']) {
    const name = decodeURIComponent(params.name)
    const res = await readCommitee(name)
    if (!res.success) notFound()
    return res.data
}
