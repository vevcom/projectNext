'use server'
import { action } from '@/actions/action'
import { CommitteeMethods } from '@/services/groups/committees/methods'

export const readCommitteesAction = action(CommitteeMethods.readCommittees)
export const readCommitteeAction = action(CommitteeMethods.readCommittee)
export const readCommitteeArticleAction = action(CommitteeMethods.readCommitteArticle)
export const readCommitteeParagraphAction = action(CommitteeMethods.readCommitteeParagraph)
export const readCommitteeMembersAction = action(CommitteeMethods.readCommitteeMembers)

