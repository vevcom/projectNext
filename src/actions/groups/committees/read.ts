'use server'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ExpandedCommittee } from './Types'
import type { ActionReturn } from '@/actions/Types'
import { readGroup, readGroups } from '../read'

/**
 * Reads all committees
 */
export async function readCommittees(): Promise<ActionReturn<ExpandedCommittee[]>> {
    // TODO: This should be protected by a permission
    return readGroups('COMMITTEE')
}

export async function readCommittee(id: number): Promise<ActionReturn<ExpandedCommittee>> {
    return readGroup(id, 'COMMITTEE')
}
