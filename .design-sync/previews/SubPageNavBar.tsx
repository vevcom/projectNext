import { SubPageNavBar, SubPageNavBarItem } from '@ohma/ui'
import { faIdCard, faLock, faPalette, faUser } from '@fortawesome/free-solid-svg-icons'

/**
 * SubPageNavBar is the container; the items are SubPageNavBarItem. Each item
 * marks itself selected by comparing the last path segment of its href against
 * the current pathname.
 */
export const UserSettings = () => (
    <SubPageNavBar>
        <SubPageNavBarItem href="/users/olanord/profile" icon={faUser}>Profil</SubPageNavBarItem>
        <SubPageNavBarItem href="/users/olanord/theme" icon={faPalette}>Utseende</SubPageNavBarItem>
        <SubPageNavBarItem href="/users/olanord/security" icon={faLock}>Sikkerhet</SubPageNavBarItem>
        <SubPageNavBarItem href="/users/olanord/membership" icon={faIdCard}>Medlemskap</SubPageNavBarItem>
    </SubPageNavBar>
)

export const WithoutIcons = () => (
    <SubPageNavBar>
        <SubPageNavBarItem href="/admin/groups">Grupper</SubPageNavBarItem>
        <SubPageNavBarItem href="/admin/permissions">Tilganger</SubPageNavBarItem>
        <SubPageNavBarItem href="/admin/mail">E-post</SubPageNavBarItem>
    </SubPageNavBar>
)
