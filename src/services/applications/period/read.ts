import 'server-only'
import { readCommittees } from "@/services/groups/committees/read";
import { CountdownInfo } from "./Types";
import { readSpecialImage } from "@/services/images/read";

export async function readPeriodCountdown({ periodName }: { periodName: string }): Promise<CountdownInfo> {
    console.log(periodName);
    const committees = await readCommittees(); //TODO: Only read committees that pert. in period.
    const standardLogo = await readSpecialImage('DAFAULT_COMMITTEE_LOGO')
    return {
        //Time should be 6th sept 2024 00:00:00
        endTime: new Date(2024, 8, 4, 22, 26, 0),
        commiteesParticipating: committees.map(committee => ({
            shortname: committee.shortName,
            logo: committee.logoImage.image ?? standardLogo,
        }))
    }
}