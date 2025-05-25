import 'server-only'
import { readCommittees } from '@/services/groups/committees/read'
import { ImageMethods } from '@/services/images/methods'
import type { CountdownInfo } from './Types'

export async function readPeriodCountdown({ periodName }: { periodName: string }): Promise<CountdownInfo> {
    console.log(periodName)
    const committees = await readCommittees() //TODO: Only read committees that pert. in period.
    const standardLogo = await ImageMethods.readSpecial.newClient().execute({
        params: {
            special: 'DAFAULT_COMMITTEE_LOGO'
        },
        session: null,
        bypassAuth: true
    })
    return {
        //Time should be 6th sept 2024 00:00:00
        endTime: new Date(2024, 8, 5, 11, 53, 0),
        commiteesParticipating: committees.map(committee => ({
            shortname: committee.shortName,
            logo: committee.logoImage.image ?? standardLogo,
        }))
    }
}
