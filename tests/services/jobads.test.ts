import { Session } from '@/auth/Session'
import { Smorekopp } from '@/services/error'
import prisma from '@/prisma'
import { JobadMethods } from '@/services/career/jobAds/methods'
import { afterEach, beforeAll, describe, expect, test } from '@jest/globals'

// NOTE: This is file contains a lot of boiler plate which should be refactored to be more reusable.
// This is only the first step in wrinting our tests.

const CREATE_JOB_AD = {
    articleName: 'Vevcom Kakebaker',
    companyId: 1,
    description: 'Vevcom søker en erfaren kakebaker med kunnskap innenfor webutvikling?',
    type: 'PART_TIME' as const,
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
}

const UPDATED_JOB_AD = {
    active: false,
    companyId: 1,
    description: 'Vevcom søker en erfaren slaufe med kunnskap innenfor hytteturplanlegging?',
    type: 'FULL_TIME' as const,
}

beforeAll(async () => {
    // TODO: Refactor to maybe use a seed function?
    await prisma.company.create({
        data: {
            name: 'Vevcom AS',
            description: 'Vevcom AS er verdensledende innenfor webutvikling og kakebaking.',
            logo: {
                create: {}
            },
        },
    })
})

afterEach(async () => {
    const jobAds = await prisma.jobAd.findMany()

    await Promise.all(jobAds.map(jobAd =>
        JobadMethods.destroy.newClient().execute({
            params: {
                id: jobAd.id
            },
            session: null,
            bypassAuth: true,
        })
    ))
})

describe('job ads', () => {
    test('create with unauthenticated user', async () => {
        expect(JobadMethods.create.newClient().execute({
            data: CREATE_JOB_AD,
            session: Session.empty()
        })).rejects.toThrow(new Smorekopp('UNAUTHENTICATED'))

        const count = await prisma.jobAd.count()
        expect(count).toBe(0)
    })

    test('create with authorized user', async () => {
        // TODO: Refactor to make use of seeded users.
        // Not using a seeded uses here is okay for now, but some other services
        // will need to use database data of the users.
        const session = Session.fromJsObject({
            memberships: [],
            permissions: ['JOBAD_CREATE'],
            user: null,
        })

        await JobadMethods.create.newClient().execute({ data: CREATE_JOB_AD, session })

        const res = await prisma.jobAd.findFirst({})
        expect(res).toMatchObject(CREATE_JOB_AD)
    })

    test('(create and then) read with unauthenticated user', async () => {
        // TODO: To avoid fragile tests, this should be refactored to use a seeded job ad.
        const createRes = await JobadMethods.create.newClient().execute({
            data: CREATE_JOB_AD,
            session: null,
            bypassAuth: true
        })

        expect(JobadMethods.read.newClient().execute({ params: { idOrName: createRes.id }, session: Session.empty() }))
            .rejects.toThrow(new Smorekopp('UNAUTHENTICATED'))
    })

    test('(create and then) read with authorized user', async () => {
        // TODO: To avoid fragile tests, this should be refactored to use a seeded job ad.
        const createRes = await JobadMethods.create.newClient().execute({
            data: CREATE_JOB_AD,
            session: null,
            bypassAuth: true
        })

        const session = Session.fromJsObject({
            memberships: [],
            permissions: ['JOBAD_READ'],
            user: null,
        })

        const readRes = await JobadMethods.read.newClient().execute({ params: { idOrName: createRes.id }, session })
        expect(readRes).toMatchObject(CREATE_JOB_AD)
    })

    test('update with unauthenticated user', async () => {
        // TODO: To avoid fragile tests, this should be refactored to use a seeded job ad.
        const createRes = await JobadMethods.create.newClient().execute({
            data: CREATE_JOB_AD,
            session: null,
            bypassAuth: true
        })

        expect(JobadMethods.update.newClient().execute({
            params: {
                id: createRes.id,
            },
            data: UPDATED_JOB_AD,
            session: Session.empty(),
        })).rejects.toThrow(new Smorekopp('UNAUTHENTICATED'))

        const res = await prisma.jobAd.findFirst({})
        expect(res).toMatchObject(CREATE_JOB_AD)
    })

    test('update with authorized user', async () => {
        // TODO: To avoid fragile tests, this should be refactored to use a seeded job ad.
        const createRes = await JobadMethods.create.newClient().execute({
            data: CREATE_JOB_AD,
            session: null,
            bypassAuth: true
        })

        const session = Session.fromJsObject({
            memberships: [],
            permissions: ['JOBAD_UPDATE'],
            user: null,
        })

        await JobadMethods.update.newClient().execute({
            params: {
                id: createRes.id,
            },
            data: UPDATED_JOB_AD,
            session,
        })

        const res = await prisma.jobAd.findFirst({})
        expect(res).toMatchObject(UPDATED_JOB_AD)
    })

    test('destroy with unauthenticated user', async () => {
        // TODO: To avoid fragile tests, this should be refactored to use a seeded job ad.
        const createRes = await JobadMethods.create.newClient().execute({
            data: CREATE_JOB_AD,
            session: null,
            bypassAuth: true
        })

        expect(JobadMethods.destroy.newClient().execute({ params: { id: createRes.id }, session: Session.empty() }))
            .rejects.toThrow(new Smorekopp('UNAUTHENTICATED'))

        const count = await prisma.jobAd.count()
        expect(count).toBe(1)
    })

    test('destroy with authorized user', async () => {
        // TODO: To avoid fragile tests, this should be refactored to use a seeded job ad.
        const createRes = await JobadMethods.create.newClient().execute({
            data: CREATE_JOB_AD,
            session: null,
            bypassAuth: true
        })

        const session = Session.fromJsObject({
            memberships: [],
            permissions: ['JOBAD_DESTROY'],
            user: null,
        })

        await JobadMethods.destroy.newClient().execute({ params: { id: createRes.id }, session })

        const count = await prisma.jobAd.count()
        expect(count).toBe(0)
    })
})
