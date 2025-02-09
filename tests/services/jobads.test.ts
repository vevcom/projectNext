import { Session } from '@/auth/Session'
import { createJobAd } from '@/services/career/jobAds/create'
import { Smorekopp } from '@/services/error'
import { readJobAd } from '@/services/career/jobAds/read'
import { destroyJobAd } from '@/services/career/jobAds/destroy'
import { updateJobAd } from '@/services/career/jobAds/update'
import prisma from '@/prisma'
import { afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import type { CreateJobAdTypes, UpdateJobAdTypes } from '@/services/career/jobAds/validation'

// NOTE: This is file contains a lot of boiler plate which should be refactored to be more reusable.
// This is only the first step in wrinting our tests.

const CREATE_JOB_AD = {
    articleName: 'Vevcom Kakebaker',
    companyId: 1,
    description: 'Vevcom søker en erfaren kakebaker med kunnskap innenfor webutvikling?',
    type: 'PART_TIME',
} satisfies CreateJobAdTypes['Detailed']

const UPDATED_JOB_AD = {
    active: false,
    companyId: 1,
    description: 'Vevcom søker en erfaren slaufe med kunnskap innenfor hytteturplanlegging?',
    type: 'FULL_TIME',
} satisfies UpdateJobAdTypes['Detailed']

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
    await prisma.jobAd.deleteMany()
})

describe('job ads', () => {
    test('create with unauthenticated user', async () => {
        expect(createJobAd.newClient().execute({ data: CREATE_JOB_AD, session: Session.empty() }))
            .rejects.toThrow(new Smorekopp('UNAUTHENTICATED'))

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

        await createJobAd.newClient().execute({ data: CREATE_JOB_AD, session })

        const res = await prisma.jobAd.findFirst({})
        expect(res).toMatchObject(CREATE_JOB_AD)
    })

    test('(create and then) read with unauthenticated user', async () => {
        // TODO: To avoid fragile tests, this should be refactored to use a seeded job ad.
        const createRes = await createJobAd.newClient().execute({ data: CREATE_JOB_AD, session: null, bypassAuth: true })

        expect(readJobAd.newClient().execute({ params: { idOrName: createRes.id }, session: Session.empty() }))
            .rejects.toThrow(new Smorekopp('UNAUTHENTICATED'))
    })

    test('(create and then) read with authorized user', async () => {
        // TODO: To avoid fragile tests, this should be refactored to use a seeded job ad.
        const createRes = await createJobAd.newClient().execute({ data: CREATE_JOB_AD, session: null, bypassAuth: true })

        const session = Session.fromJsObject({
            memberships: [],
            permissions: ['JOBAD_READ'],
            user: null,
        })

        const readRes = await readJobAd.newClient().execute({ params: { idOrName: createRes.id }, session })
        expect(readRes).toMatchObject(CREATE_JOB_AD)
    })

    test('update with unauthenticated user', async () => {
        // TODO: To avoid fragile tests, this should be refactored to use a seeded job ad.
        const createRes = await createJobAd.newClient().execute({ data: CREATE_JOB_AD, session: null, bypassAuth: true })

        expect(updateJobAd.newClient().execute({
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
        const createRes = await createJobAd.newClient().execute({ data: CREATE_JOB_AD, session: null, bypassAuth: true })

        const session = Session.fromJsObject({
            memberships: [],
            permissions: ['JOBAD_UPDATE'],
            user: null,
        })

        await updateJobAd.newClient().execute({
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
        const createRes = await createJobAd.newClient().execute({ data: CREATE_JOB_AD, session: null, bypassAuth: true })

        expect(destroyJobAd.newClient().execute({ params: { id: createRes.id }, session: Session.empty() }))
            .rejects.toThrow(new Smorekopp('UNAUTHENTICATED'))

        const count = await prisma.jobAd.count()
        expect(count).toBe(1)
    })

    test('destroy with authorized user', async () => {
        // TODO: To avoid fragile tests, this should be refactored to use a seeded job ad.
        const createRes = await createJobAd.newClient().execute({ data: CREATE_JOB_AD, session: null, bypassAuth: true })

        const session = Session.fromJsObject({
            memberships: [],
            permissions: ['JOBAD_DESTROY'],
            user: null,
        })

        await destroyJobAd.newClient().execute({ params: { id: createRes.id }, session })

        const count = await prisma.jobAd.count()
        expect(count).toBe(0)
    })
})
