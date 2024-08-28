import type { Prisma } from '@prisma/client'
import { Permission } from '@prisma/client'
import { PermissionInfo } from './Types'

export const permissionCategories = [
    'OmegaQuotes', 
    'ombul',
    'groups',
    'jobad',
    'diverse admin',
    'cms',
    'brukere',
    'bilder',
    'events',
    'notifikasjoner',
    'mail',
] as const satisfies string[]

export const PermissionConfig = {
    OMEGAQUOTES_READ: {
        name: 'Les OmegaQuotes',
        description: 'kan lese OmegaQuotes',
        category: 'OmegaQuotes',
    },
    OMEGAQUOTES_WRITE: {
        name: 'Skrive OmegaQuotes',
        description: 'kan skrive OmegaQuotes',
        category: 'OmegaQuotes',
    },
    OMBUL_CREATE: {
        name: 'Lage ombul',
        description: 'kan lage ombul',
        category: 'ombul',
    },
    OMBUL_UPDATE: {
        name: 'Oppdatere ombul',
        description: 'kan oppdatere ombul',
        category: 'ombul',
    },
    OMBUL_DESTROY: {
        name: 'Slette ombul',
        description: 'kan slette ombul',
        category: 'ombul',
    },
    OMBUL_READ: {
        name: 'Les ombul',
        description: 'kan lese ombul',
        category: 'ombul',
    },
    OMEGA_MEMBERSHIP_GROUP_READ: {
        name: 'Les Omega medlemsgrupper',
        description: 'kan lese Omega medlemsgrupper',
        category: 'groups',
    },
    CLASS_CREATE: {
        name: 'Lage klasse',
        description: 'kan lage klasse',
        category: 'groups',
    },
    CLASS_UPDATE: {
        name: 'Oppdatere klasse',
        description: 'kan oppdatere klasse',
        category: 'groups',
    },
    CLASS_DESTROY: {
        name: 'Slette klasse',
        description: 'kan slette klasse',
        category: 'groups',
    },
    CLASS_READ: {
        name: 'Les klasse',
        description: 'kan lese klasse',
        category: 'groups',
    },
    COMMITTEE_CREATE: {
        name: 'Lage komite',
        description: 'kan lage komite',
        category: 'groups',
    },
    COMMITTEE_DESTROY: {
        name: 'Slette komite',
        description: 'kan slette komite',
        category: 'groups',
    },
    COMMITTEE_READ: {
        name: 'Les komite',
        description: 'kan lese komite',
        category: 'groups',
    },
    COMMITTEE_UPDATE: {
        name: 'Oppdatere komite',
        description: 'kan oppdatere komite',
        category: 'groups',
    },
    INTEREST_GROUP_CREATE: {
        name: 'Lage interessegruppe',
        description: 'kan lage interessegruppe',
        category: 'groups',
    },
    INTEREST_GROUP_DESTROY: {
        name: 'Slette interessegruppe',
        description: 'kan slette interessegruppe',
        category: 'groups',
    },
    INTEREST_GROUP_READ: {
        name: 'Les interessegruppe',
        description: 'kan lese interessegruppe',
        category: 'groups',
    },
    INTEREST_GROUP_UPDATE: {
        name: 'Oppdatere interessegruppe',
        description: 'kan oppdatere interessegruppe',
        category: 'groups',
    },
    OMEGA_MEMBERSHIP_GROUP_UPDATE: {
        name: 'Oppdatere Omega medlemsgrupper',
        description: 'kan oppdatere Omega medlemsgrupper',
        category: 'groups',
    },
    STUDY_PROGRAMME_CREATE: {
        name: 'Lage studieprogram',
        description: 'kan lage studieprogram',
        category: 'groups',
    },
    STUDY_PROGRAMME_DESTROY: {
        name: 'Slette studieprogram',
        description: 'kan slette studieprogram',
        category: 'groups',
    },
    STUDY_PROGRAMME_READ: {
        name: 'Les studieprogram',
        description: 'kan lese studieprogram',
        category: 'groups',
    },
    STUDY_PROGRAMME_UPDATE: {
        name: 'Oppdatere studieprogram',
        description: 'kan oppdatere studieprogram',
        category: 'groups',
    },
    GROUP_READ: {
        name: 'Les grupper',
        description: 'kan lese grupper',
        category: 'groups',
    },
    GROUP_DESTROY: {
        name: 'Slette grupper',
        description: 'kan slette grupper',
        category: 'groups',
    },
    GROUP_ADMIN: {
        name: 'Gruppeadministrator',
        description: 'kan administrere grupper',
        category: 'groups',
    },
    JOBAD_CREATE: {
        name: 'Lage jobad',
        description: 'kan lage jobad',
        category: 'jobad',
    },
    JOBAD_UPDATE: {
        name: 'Oppdatere jobad',
        description: 'kan oppdatere jobad',
        category: 'jobad',
    },
    JOBAD_DESTROY: {
        name: 'Slette jobad',
        description: 'kan slette jobad',
        category: 'jobad',
    },
    JOBAD_READ: {
        name: 'Les jobad',
        description: 'kan lese jobad',
        category: 'jobad',
    },
    OMEGA_ORDER_CREATE: {
        name: 'Lag ny omega orden',
        description: 'kan inkrementere omega',
        category: 'diverse admin',
    },
    OMEGA_ORDER_READ: {
        name: 'Les omega orden',
        description: 'kan lese omega',
        category: 'diverse admin',
    },
    CMS_ADMIN: {
        name: 'CMS administrator',
        description: 'kan administrere CMS',
        category: 'cms',
    },
    USERS_CREATE: {
        name: 'Lage bruker',
        description: 'kan lage bruker',
        category: 'brukere',
    },
    USERS_DESTROY: {
        name: 'Slette bruker',
        description: 'kan slette bruker',
        category: 'brukere',
    },
    USERS_READ: {
        name: 'Les bruker',
        description: 'kan lese bruker',
        category: 'brukere',
    },
    USERS_UPDATE: {
        name: 'Oppdatere bruker',
        description: 'kan oppdatere bruker',
        category: 'brukere',
    },
    IMAGE_ADMIN: {
        name: 'Bildeadministrator',
        description: 'kan administrere bilder',
        category: 'bilder',
    },
    IMAGE_COLLECTION_CREATE: {
        name: 'Lage bilde samling',
        description: 'kan lage bilde samling',
        category: 'bilder',
    },
    EVENT_CREATE: {
        name: 'Lage event',
        description: 'kan lage event',
        category: 'events',
    },
    EVENT_ADMIN: {
        name: 'Eventadministrator',
        description: 'kan administrere events',
        category: 'events',
    },
    NOTIFICATION_CHANNEL_CREATE: {
        name: 'Lage notifikasjonskanal',
        description: 'kan lage notifikasjonskanal',
        category: 'notifikasjoner',
    },
    NOTIFICATION_CHANNEL_READ: {
        name: 'Les notifikasjonskanal',
        description: 'kan lese notifikasjonskanal',
        category: 'notifikasjoner',
    },
    NOTIFICATION_CHANNEL_UPDATE: {
        name: 'Oppdatere notifikasjonskanal',
        description: 'kan oppdatere notifikasjonskanal',
        category: 'notifikasjoner',
    },
    NOTIFICATION_CREATE: {
        name: 'Lage notifikasjon',
        description: 'kan lage notifikasjon',
        category: 'notifikasjoner',
    },
    NOTIFICATION_SUBSCRIPTION_READ: {
        name: 'Les notifikasjonsabonnement',
        description: 'kan lese notifikasjonsabonnement',
        category: 'notifikasjoner',
    },
    NOTIFICATION_SUBSCRIPTION_READ_OTHER: {
        name: 'Les andres notifikasjonsabonnement',
        description: 'kan lese andres notifikasjonsabonnement',
        category: 'notifikasjoner',
    },
    NOTIFICATION_SUBSCRIPTION_UPDATE: {
        name: 'Oppdatere notifikasjonsabonnement',
        description: 'kan oppdatere notifikasjonsabonnement',
        category: 'notifikasjoner',
    },
    NOTIFICATION_SUBSCRIPTION_UPDATE_OTHER: {
        name: 'Oppdatere andres notifikasjonsabonnement',
        description: 'kan oppdatere andres notifikasjonsabonnement',
        category: 'notifikasjoner',
    },
    MAIL_SEND: {
        name: 'Sende epost',
        description: 'kan sende epost',
        category: 'mail',
    },
    MAILADDRESS_EXTERNAL_CREATE: {
        name: 'Lage ekstern epostadresse',
        description: 'kan lage ekstern epostadresse',
        category: 'mail',
    },
    MAILADDRESS_EXTERNAL_DESTROY: {
        name: 'Slette ekstern epostadresse',
        description: 'kan slette ekstern epostadresse',
        category: 'mail',
    },
    MAILADDRESS_EXTERNAL_READ: {
        name: 'Les ekstern epostadresse',
        description: 'kan lese ekstern epostadresse',
        category: 'mail',
    },
    MAILADDRESS_EXTERNAL_UPDATE: {
        name: 'Oppdatere ekstern epostadresse',
        description: 'kan oppdatere ekstern epostadresse',
        category: 'mail',
    },
    MAILALIAS_CREATE: {
        name: 'Lage epostalias',
        description: 'kan lage epostalias',
        category: 'mail',
    },
    MAILALIAS_DESTORY: {
        name: 'Slette epostalias',
        description: 'kan slette epostalias',
        category: 'mail',
    },
    MAILALIAS_READ: {
        name: 'Les epostalias',
        description: 'kan lese epostalias',
        category: 'mail',
    },
    MAILALIAS_UPDATE: {
        name: 'Oppdatere epostalias',
        description: 'kan oppdatere epostalias',
        category: 'mail',
    },
    MAILINGLIST_ALIAS_CREATE: {
        name: 'Lage epostliste alias',
        description: 'kan lage epostliste alias',
        category: 'mail',
    },
    MAILINGLIST_ALIAS_DESTROY: {
        name: 'Slette epostliste alias',
        description: 'kan slette epostliste alias',
        category: 'mail',
    },
    MAILINGLIST_CREATE: {
        name: 'Lage epostliste',
        description: 'kan lage epostliste',
        category: 'mail',
    },
    MAILINGLIST_DESTROY: {
        name: 'Slette epostliste',
        description: 'kan slette epostliste',
        category: 'mail',
    },
    MAILINGLIST_EXTERNAL_ADDRESS_CREATE: {
        name: 'Lage ekstern epostliste adresse',
        description: 'kan lage ekstern epostliste adresse',
        category: 'mail',
    },
    MAILINGLIST_EXTERNAL_ADDRESS_DESTROY: {
        name: 'Slette ekstern epostliste adresse',
        description: 'kan slette ekstern epostliste adresse',
        category: 'mail',
    },
    MAILINGLIST_GROUP_CREATE: {
        name: 'Lage epostliste gruppe',
        description: 'kan lage epostliste gruppe',
        category: 'mail',
    },
    MAILINGLIST_GROUP_DESTROY: {
        name: 'Slette epostliste gruppe',
        description: 'kan slette epostliste gruppe',
        category: 'mail',
    },
    MAILINGLIST_READ: {
        name: 'Les epostliste',
        description: 'kan lese epostliste',
        category: 'mail',
    },
    MAILINGLIST_UPDATE: {
        name: 'Oppdatere epostliste',
        description: 'kan oppdatere epostliste',
        category: 'mail',
    },
    MAILINGLIST_USER_CREATE: {
        name: 'Lage epostliste bruker',
        description: 'kan lage epostliste bruker',
        category: 'mail',
    },
    MAILINGLIST_USER_DESTROY: {
        name: 'Slette epostliste bruker',
        description: 'kan slette epostliste bruker',
        category: 'mail',
    },
    ADMISSION_TRIAL_CREATE: {
        name: 'Lage opptak prøve',
        description: 'kan lage opptak prøve',
        category: 'brukere',
    },
    APIKEY_ADMIN: {
        name: 'API nøkkel administrator',
        description: 'kan administrere API nøkler',
        category: 'diverse admin',
    }
} satisfies Record<Permission, PermissionInfo>

export const expandedRoleIncluder = {
    permissions: {
        select: {
            permission: true,
        },
    },
    groups: {
        select: {
            groupId: true,
            forAdminsOnly: true,
        },
    },
} as const satisfies Prisma.RoleInclude
