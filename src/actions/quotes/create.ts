'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { ActionReturn } from '@/actions/type'
import { OmegaQutoe } from '@prisma/client'

export default async function create(rawdata: FormData) : Promise<ActionReturn<OmegaQutoe>> {
    
}