'use client'
import { faArrowLeft, faCog, faInfo, faUsers } from '@fortawesome/free-solid-svg-icons'
import { usePathname } from 'next/navigation'
import { SubPageNavBar, SubPageNavBarItem } from '@/components/NavBar/SideNavBar/SubPageNavBar'

type PropTypes = {
    shortName: string
}

export default function Nav({ shortName }: PropTypes) {
    const pathname = usePathname()
    console.log(pathname)

    const settingsPath = `/committees/${shortName}/admin`
    const membersPath = `/committees/${shortName}/members`
    const aboutPath = `/committees/${shortName}/about`

    return (
        <SubPageNavBar>
            <SubPageNavBarItem icon={faCog} href={settingsPath}>Innstillinger</SubPageNavBarItem>
            <SubPageNavBarItem icon={faUsers} href={membersPath}>Members</SubPageNavBarItem>
            <SubPageNavBarItem icon={faInfo} href={aboutPath}>About</SubPageNavBarItem>
            <SubPageNavBarItem icon={faArrowLeft} href={
                pathname === `/committees/${shortName}` ? '/committees' : `/committees/${shortName}`
            }>
                Back
            </SubPageNavBarItem>
        </SubPageNavBar>
    )
}
