import { Session } from "@/auth/Session";
import { createJobAd } from "@/services/career/jobAds/create";
import { CreateJobAdTypes } from "@/services/career/jobAds/validation";
import { Smorekopp } from "@/services/error";
import { describe, expect, test } from "@jest/globals";

const TEST_JOB_AD = {
    articleName: 'Vevcom Kakebaker',
    companyId: 1,
    description: 'Vevcom søker en erfaren kakebaker med erfaring innenfor webutvikling?',
    type: 'PART_TIME',
} satisfies CreateJobAdTypes['Detailed']

describe("Job Ads", () => {
    test("create with unauthenticated user", async () => {
        expect(createJobAd.newClient().execute({ data: TEST_JOB_AD, session: null }))
            .rejects.toThrow(new Smorekopp('UNAUTHENTICATED'))
    })

    test("create with authorized user", async () => {
        const session = await Session.fromJsObject({
            memberships: [],
            permissions: ['JOBAD_CREATE'],
            user: null,
        })
        
        const res = await createJobAd.newClient().execute({ data: TEST_JOB_AD, session })
        
        expect(res).toMatchObject(TEST_JOB_AD)
    })
})