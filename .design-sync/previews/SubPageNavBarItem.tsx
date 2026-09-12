import { SubPageNavBar, SubPageNavBarItem } from '@ohma/ui'
import { faLock, faPalette, faUser } from '@fortawesome/free-solid-svg-icons'

/**
 * A SubPageNavBarItem only lays out correctly inside SubPageNavBar, so every
 * cell composes it through its real parent.
 */
export const WithIcon = () => (
    <SubPageNavBar>
        <SubPageNavBarItem href="/users/olanord/profile" icon={faUser}>Profil</SubPageNavBarItem>
    </SubPageNavBar>
)

export const WithoutIcon = () => (
    <SubPageNavBar>
        <SubPageNavBarItem href="/admin/groups">Grupper</SubPageNavBarItem>
    </SubPageNavBar>
)

export const SeveralItems = () => (
    <SubPageNavBar>
        <SubPageNavBarItem href="/users/olanord/theme" icon={faPalette}>Utseende</SubPageNavBarItem>
        <SubPageNavBarItem href="/users/olanord/security" icon={faLock}>Sikkerhet</SubPageNavBarItem>
    </SubPageNavBar>
)
