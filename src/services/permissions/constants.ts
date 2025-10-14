import type { Permission } from '@prisma/client'
import type { PermissionInfo } from './types'

export const permissionCategories = [
    'omega quotes',
    'ombul',
    'groups',
    'jobad',
    'diverse admin',
    'brukere',
    'bilder',
    'events',
    'notifikasjoner',
    'mail',
    'skjermer',
    'shop',
    'cabin',
    'permission',
    'applications',
    'frontpage'
] as const satisfies string[]

export const permissionConfig = {
    OMEGAQUOTES_READ: {
        name: 'Les OmegaQuotes',
        description: 'kan lese OmegaQuotes',
        category: 'omega quotes',
    },
    OMEGAQUOTES_WRITE: {
        name: 'Skrive OmegaQuotes',
        description: 'kan skrive OmegaQuotes',
        category: 'omega quotes',
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
    INTEREST_GROUP_READ: {
        name: 'Les interessegruppe',
        description: 'kan lese interessegruppe',
        category: 'groups',
    },
    INTEREST_GROUP_ADMIN: {
        name: 'Administrere interessegruppe',
        description: 'Administrere interessegruppe uten å være admin i gruppen. Og lage nye grupper',
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
    FRONTPAGE_ADMIN: {
        name: 'Frontpage administrator',
        description: 'kan administrere frontpage',
        category: 'frontpage',
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
    USERS_CONNECT_STUDENT_CARD: {
        name: 'Koble studentkort til andre brukere',
        description: `Kan legge til andre personer i registreringskøen for å 
        registrere et kort og kan registrere et kort på en person`,
        category: 'brukere'
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
    },
    SCREEN_ADMIN: {
        name: 'Skjermadministrator',
        description: 'kan administrere skjermer',
        category: 'skjermer',
    },
    SCREEN_READ: {
        name: 'Les skjermer',
        description: 'kan lese skjermer',
        category: 'skjermer',
    },
    SCHOOLS_READ: {
        name: 'Les skoler',
        description: 'kan lese skoler',
        category: 'brukere',
    },
    SCHOOLS_ADMIN: {
        name: 'Skoleadministrator',
        description: 'kan administrere skoler',
        category: 'brukere',
    },
    COURSES_READ: {
        name: 'Les emner',
        description: 'kan lese emner',
        category: 'brukere',
    },
    COURSES_ADMIN: {
        name: 'Emneadministrator',
        description: 'kan administrere emner',
        category: 'brukere',
    },
    LOCKER_USE: {
        name: 'Bruke skap',
        description: 'kan opprette skapreservasjoner',
        category: 'brukere'
    },
    LOCKER_ADMIN: {
        name: 'Administrere skap',
        description: 'kan opprette og slette reservasjoner på veiene av andre samt opprette og slette selve skapene',
        category: 'diverse admin'
    },
    COMPANY_ADMIN: {
        name: 'Bedriftsadministrator',
        description: 'kan administrere bedrifter',
        category: 'brukere'
    },
    COMPANY_READ: {
        name: 'Les bedrifter',
        description: 'kan lese bedrifter',
        category: 'brukere'
    },
    DOTS_ADMIN: {
        name: 'Prikkadministrator',
        description: 'kan administrere prikker',
        category: 'brukere'
    },
    SHOP_READ: {
        name: 'Les butikker',
        description: 'kan lese butikker',
        category: 'shop'
    },
    SHOP_ADMIN: {
        name: 'Butikk administrator',
        description: 'Kan administrere alle butikker',
        category: 'shop'
    },
    PRODUCT_READ: {
        name: 'Les produkter',
        description: 'Kan lese produkter',
        category: 'shop'
    },
    PRODUCT_ADMIN: {
        name: 'Produkt administrator',
        description: 'Kan administrare alle produkter',
        category: 'shop'
    },
    PURCHASE_CREATE: {
        name: 'Gjennomfør kjøp',
        description: 'Kan gjennomføre et kjøp i en butikk',
        category: 'shop'
    },
    PURCHASE_CREATE_ONBEHALF: {
        name: 'Kan ta betalt i en butikk',
        description: 'Kan belaste andre brukerkontoer, når de handler i en butikk.',
        category: 'shop'
    },
    LICENSE_ADMIN: {
        name: 'Lisensadministrator',
        description: `
            kan administrere lisenser. Alle som eier et bilde kan 
            legge til en lisens uavhengig av denne tillatelsen
        `,
        category: 'diverse admin'
    },
    EVENT_READ: {
        name: 'Les arrangementer',
        description: 'kan lese arrangementer',
        category: 'events'
    },
    EVENT_REGISTRATION_CREATE: {
        name: 'Meld deg på arrangementer',
        description: 'kan melde seg på arrangementer',
        category: 'events'
    },
    EVENT_REGISTRATION_DESROY: {
        name: 'Meld deg av arrangementer',
        description: 'kan melde seg av arrangementer',
        category: 'events'
    },
    EVENT_REGISTRATION_READ: {
        name: 'Les påemeldinger',
        description: 'kan lese påmeldinger',
        category: 'events'
    },
    CABIN_BOOKING_BED_CREATE: {
        name: 'Booke senger i hytta',
        description: 'Kan booke en senger i hytta',
        category: 'cabin'
    },
    CABIN_BOOKING_CABIN_CREATE: {
        name: 'Booke hytta',
        description: 'Kan booke hele hytta',
        category: 'cabin'
    },
    CABIN_BOOKING_ADMIN: {
        name: 'Hyttebooking administrator',
        description: 'Kan administrere hyttebookinger',
        category: 'cabin'
    },
    CABIN_CALENDAR_READ: {
        name: 'Les hyttekalender',
        description: 'Kan lese hyttekalender',
        category: 'cabin'
    },
    CABIN_ADMIN: {
        name: 'Hyttedministrator',
        description: 'Kan administrere hytter',
        category: 'cabin'
    },
    CABIN_PRODUCTS_ADMIN: {
        name: 'Hytteprodukt administrator',
        description: 'Kan administrere hyttprodukter',
        category: 'cabin'
    },
    PERMISSION_DEFAULT_ADMIN: {
        name: 'Endre standardtilganger',
        description: 'Kan endre standardtilganger',
        category: 'permission'
    },
    PERMISSION_GROUP_READ: {
        name: 'Les tilganger til grupper',
        description: 'Kan lese tilganger til grupper',
        category: 'permission'
    },
    PERMISSION_GROUP_ADMIN: {
        name: 'Administrere tilganger til grupper',
        description: 'Kan administrere tilganger til grupper',
        category: 'permission'
    },
    APPLICATION_ADMIN: {
        name: 'Søknadsadministrator',
        description: `
            Lag søknadsperioder, les søknader og administrer/moderere søknader.
            Komitemedlemmer kan også lese søknader til sin komite.
        `,
        category: 'applications',
    },
    APPLICATION_WRITE: {
        name: 'Søknadsskriver',
        description: `
            Kan skrive søknader til alle aktive søknadsperioder. 
        `,
        category: 'applications',
    },
} satisfies Record<Permission, PermissionInfo>
