'use client'
import { SubPageNavBar, SubPageNavBarItem } from '@/components/NavBar/SubPageNavBar/SubPageNavBar'
import { faArrowLeft, faCog, faInfo, faScroll, faUsers } from '@fortawesome/free-solid-svg-icons'
import { usePathname } from 'next/navigation'
import type { AuthResultTypeAny } from '@/auth/authorizer/AuthResult'

type PropTypes = {
    shortName: string,
    canReadCommitteeApplication: AuthResultTypeAny
}

export default function Nav({ shortName, canReadCommitteeApplication }: PropTypes) {
    const pathname = usePathname()

    const adminPath = `/committees/${shortName}/admin`
    const readPeriodesPath = `/committees/${shortName}/applicationPeriods`
    const membersPath = `/committees/${shortName}/members`
    const aboutPath = `/committees/${shortName}/about`

    return (
        <SubPageNavBar>
            <SubPageNavBarItem icon={faCog} href={adminPath}>Innstillinger</SubPageNavBarItem>
            {canReadCommitteeApplication.authorized &&
                <SubPageNavBarItem icon={faScroll} href={readPeriodesPath}>Søknadsperioder</SubPageNavBarItem>
            }
            <SubPageNavBarItem icon={faUsers} href={membersPath}>Medlemmer</SubPageNavBarItem>
            <SubPageNavBarItem icon={faInfo} href={aboutPath}>Om</SubPageNavBarItem>
            <SubPageNavBarItem icon={faArrowLeft} href={
                pathname === `/committees/${shortName}` ? '/committees' : `/committees/${shortName}`
            }>
                Tilbake
            </SubPageNavBarItem>
        </SubPageNavBar>
    )
}
