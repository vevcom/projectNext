import { SubPageNavBar, SubPageNavBarItem } from '@/components/NavBar/SubPageNavBar/SubPageNavBar'
import {
    faCircleDot,
    faCog,
    faHatWizard,
    faKey,
    faPaperPlane,
    faSwatchbook,
    faUser,
} from '@fortawesome/free-solid-svg-icons'

type PropTypes = {
    username: string,
    canAssignFlairs: boolean,
}

export default function UserAdminNavBar({ username, canAssignFlairs }: PropTypes) {
    return (
        <SubPageNavBar>
            <SubPageNavBarItem icon={faUser} href={`/users/${username}`}>
                Profil
            </SubPageNavBarItem>
            <SubPageNavBarItem icon={faCircleDot} href={`/users/${username}/dots`}>
                Prikker
            </SubPageNavBarItem>
            <SubPageNavBarItem icon={faPaperPlane} href={`/users/${username}/notifications`}>
                Notifikasjoner
            </SubPageNavBarItem>
            <SubPageNavBarItem icon={faKey} href={`/users/${username}/permissions`}>
                Tilganger
            </SubPageNavBarItem>
            {canAssignFlairs && (
                <SubPageNavBarItem icon={faHatWizard} href={`/users/${username}/flairs`}>
                    Kapper
                </SubPageNavBarItem>
            )}
            <SubPageNavBarItem icon={faSwatchbook} href={`/users/${username}/theme`}>
                Tema
            </SubPageNavBarItem>
            <SubPageNavBarItem icon={faCog} href={`/users/${username}/settings`}>
                Innstillinger
            </SubPageNavBarItem>
        </SubPageNavBar>
    )
}
