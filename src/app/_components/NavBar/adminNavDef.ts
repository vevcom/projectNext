import { userAuth } from '@/services/users/auth'
import { committeeAuth } from '@/services/groups/committees/auth'
import { admissionAuth } from '@/services/admission/auth'
import { omegaOrderAuth } from '@/services/omegaOrder/auth'
import { groupAuth } from '@/services/groups/auth'
import { studyProgrammeAuth } from '@/services/groups/studyProgrammes/auth'
import { permissionsAuth } from '@/services/permissions/auth'
import { apiKeyAuth } from '@/services/apiKeys/auth'
import { notificationAuth } from '@/services/notifications/auth'
import { notificationChannelAuth } from '@/services/notifications/channel/auth'
import { mailAliasAuth } from '@/services/mail/alias/auth'
import { mailingListAuth } from '@/services/mail/list/auth'
import { mailAddressExternalAuth } from '@/services/mail/mailAddressExternal/auth'
import { schoolAuth } from '@/services/education/schools/auth'
import { dotAuth } from '@/services/dots/auth'
import { cabinBookingAuth } from '@/services/cabin/booking/auth'
import { cabinProductAuth } from '@/services/cabin/product/auth'
import { cabinPricePeriodAuth } from '@/services/cabin/pricePeriod/auth'
import { shopAuth } from '@/services/shop/shop/auth'
import { productAuth } from '@/services/shop/product/auth'
import { licenseAuth } from '@/services/licenses/auth'
import { flairAuth } from '@/services/flairs/auth'
import { ledgerAccountAuth } from '@/services/ledger/accounts/auth'
import {
    faBeer,
    faChild,
    faKey,
    faNewspaper,
    faUser,
    faUserGroup,
    faPaperPlane,
    faSchool,
    faDotCircle,
    faHouse,
    faShop,
    faListDots,
    faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import type { AuthorizerDynamicFieldsBound } from '@/auth/authorizer/Authorizer'
import type { SessionMaybeUser } from '@/auth/session/Session'

type AdminLink = {
    title: string
    href: string
    /**
     * The permission(s) required to actually use this admin page - i.e. whether it's worth
     * showing the link at all. When it's a list, the link is visible if ANY of them authorize.
     * `undefined` means the page has no backing permission yet (e.g. it's a stub/placeholder),
     * so the link is always shown.
     */
    requiredAuthorizer?: AuthorizerDynamicFieldsBound | AuthorizerDynamicFieldsBound[]
}

/**
 * Declaration for the admin navigation links, alongside the permission that gates each one -
 * shared between the admin sidebar (which filters links by it) and the site-wide nav (which
 * uses it to decide whether to show an "Admin" entry point at all).
 */
export const adminNavigations = [
    {
        header: {
            icon: faUser,
            title: 'Brukere'
        },
        links: [
            {
                title: 'Brukere',
                href: '/admin/users',
                requiredAuthorizer: userAuth.create.dynamicFields({}),
            }
        ],
    },
    {
        header: {
            icon: faNewspaper,
            title: 'CMS'
        },
        links: [
            {
                title: 'Rediger cms',
                href: '/admin/cms',
            }
        ],
    },
    {
        header: {
            icon: faBeer,
            title: 'Komitéer'
        },
        links: [
            {
                title: 'Opprett komité',
                href: '/admin/committees',
                requiredAuthorizer: committeeAuth.create.dynamicFields({}),
            }
        ],
    },
    {
        header: {
            icon: faChild,
            title: 'Opptak'
        },
        links: [
            {
                title: 'Phaestum',
                href: '/admin/phaestum',
            },
            {
                title: 'Opptak',
                href: '/admin/admission',
                requiredAuthorizer: admissionAuth.createTrial.dynamicFields({}),
            },
            {
                title: 'Omegas tilstand',
                href: '/admin/stateOfOmega',
                requiredAuthorizer: omegaOrderAuth.create.dynamicFields({}),
            }
        ],
    },
    {
        header: {
            icon: faUserGroup,
            title: 'Grupper'
        },
        links: [
            {
                title: 'Grupper',
                href: '/admin/groups',
                requiredAuthorizer: groupAuth.admin.dynamicFields({}),
            },
            {
                title: 'Klasser',
                href: '/admin/classes',
            },
            {
                title: 'Studieprogrammer',
                href: '/admin/study-programmes',
                requiredAuthorizer: studyProgrammeAuth.create.dynamicFields({}),
            }
        ],
    },
    {
        header: {
            icon: faKey,
            title: 'Tillgangsstyring'
        },
        links: [
            {
                title: 'Gruppe Tilganger',
                href: '/admin/group-permissions',
                requiredAuthorizer: permissionsAuth.readGroupPermissions.dynamicFields({}),
            },
            {
                title: 'Standard Tilganger',
                href: '/admin/default-permissions',
                requiredAuthorizer: permissionsAuth.updateDefaultPermissions.dynamicFields({}),
            },
            {
                title: 'Api Nøkler',
                href: '/admin/api-keys',
                requiredAuthorizer: apiKeyAuth.readMany.dynamicFields({}),
            },
        ],
    },
    {
        header: {
            icon: faPaperPlane,
            title: 'Varslinger'
        },
        links: [
            {
                title: 'Send varsel',
                href: '/admin/send-notification',
                requiredAuthorizer: notificationAuth.create.dynamicFields({}),
            },
            {
                title: 'Varslingkanaler',
                href: '/admin/notification-channels',
                requiredAuthorizer: notificationChannelAuth.create.dynamicFields({}),
            },
            {
                title: 'Mailing lister',
                href: '/admin/mail',
                requiredAuthorizer: [
                    mailAliasAuth.create.dynamicFields({}),
                    mailingListAuth.create.dynamicFields({}),
                    mailAddressExternalAuth.create.dynamicFields({}),
                ],
            },
            {
                title: 'Send e-post',
                href: '/admin/send-mail',
                requiredAuthorizer: notificationAuth.sendMail.dynamicFields({}),
            }
        ]
    }, {
        header: {
            icon: faSchool,
            title: 'Fagvev'
        },
        links: [
            {
                title: 'Skoler',
                href: '/admin/schools',
                requiredAuthorizer: schoolAuth.create.dynamicFields({}),
            },
            {
                title: 'Emnekatalog',
                href: '/admin/courses',
                requiredAuthorizer: schoolAuth.create.dynamicFields({}),
            }
        ],
    },
    {
        header: {
            icon: faDotCircle,
            title: 'Prikker'
        },
        links: [
            {
                title: 'Prikker',
                href: '/admin/dots',
                requiredAuthorizer: dotAuth.readPage.dynamicFields({}),
            },
            {
                title: 'Frysperioder',
                href: '/admin/dots-freeze-periods',
                requiredAuthorizer: dotAuth.readPage.dynamicFields({}),
            },
        ]
    },
    {
        header: {
            icon: faHouse,
            title: 'Heutte'
        },
        links: [
            {
                title: 'Perioder',
                href: '/admin/cabin-periods',
                requiredAuthorizer: cabinPricePeriodAuth.create.dynamicFields({}),
            },
            {
                title: 'Produkter',
                href: '/admin/cabin-product',
                requiredAuthorizer: cabinProductAuth.create.dynamicFields({}),
            },
            {
                title: 'Bookinger',
                href: '/admin/cabin-booking',
                requiredAuthorizer: cabinBookingAuth.readMany.dynamicFields({}),
            },
        ]
    },
    {
        header: {
            icon: faShop,
            title: 'Shop'
        },
        links: [
            {
                title: 'Butikker',
                href: '/admin/shop',
                requiredAuthorizer: shopAuth.read.dynamicFields({}),
            },
            {
                title: 'Produkter',
                href: '/admin/product',
                requiredAuthorizer: productAuth.read.dynamicFields({}),
            },
        ]
    },
    {
        header: {
            title: 'Økonomi',
            icon: faMoneyBillWave
        },
        links: [
            {
                title: 'Kontoer',
                href: '/admin/accounts',
                requiredAuthorizer: ledgerAccountAuth.readPage.dynamicFields({}),
            },
        ]
    },
    {
        header: {
            title: 'Annet',
            icon: faListDots
        },
        links: [
            {
                title: 'Lisenser',
                href: '/admin/licenses',
                requiredAuthorizer: licenseAuth.read.dynamicFields({}),
            },
            {
                title: 'Flairs',
                href: '/admin/flairs',
                requiredAuthorizer: flairAuth.update.dynamicFields({}),
            },
            {
                title: 'Komponenter',
                href: '/admin/component-test',
            },
        ]
    }
] satisfies {
    header: {
        icon: IconDefinition
        title: string
    },
    links: AdminLink[]
}[]

function linkIsAuthorized(link: AdminLink, session: SessionMaybeUser): boolean {
    if (!link.requiredAuthorizer) return true
    const authorizers = Array.isArray(link.requiredAuthorizer) ? link.requiredAuthorizer : [link.requiredAuthorizer]
    return authorizers.some(authorizer => authorizer.auth(session).authorized)
}

export function adminLinksAuthorizedFor(session: SessionMaybeUser) {
    return adminNavigations
        .map(navigation => ({
            ...navigation,
            links: navigation.links.filter(link => linkIsAuthorized(link, session)),
        }))
        .filter(navigation => navigation.links.length > 0)
}

/**
 * Whether the user has access to at least one admin page - i.e. whether it's worth showing an
 * "Admin" entry point in the site-wide nav at all.
 */
export function hasAnyAdminAccess(session: SessionMaybeUser): boolean {
    return adminNavigations.some(navigation => navigation.links.some(link => linkIsAuthorized(link, session)))
}
