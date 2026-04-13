import type { StandardImage } from '@/prisma-generated-pn/enums'
import type { StandardLicenseName } from '@/services/licenses/constants'

export const StandardImageConfig = {
    DEFAULT_IMAGE: {
        name: 'default_image',
        alt: 'standard bilde (ikke funnet)',
        standardStoreLocation: 'default_image.jpeg',
        credit: null,
        license: null,
    },
    DEFAULT_IMAGE_COLLECTION_COVER: {
        name: 'lens_camera',
        alt: 'Et kamera med en linse',
        standardStoreLocation: 'lens_camera.jpeg',
        credit: null,
        license: null,
    },
    DEFAULT_PROFILE_IMAGE: {
        name: 'default_profile_image',
        alt: 'standard profilbilde',
        standardStoreLocation: 'default_profile_image.png',
        credit: null,
        license: null,
    },
    DEFAULT_COMMITTEE_LOGO: {
        name: 'default_committee_logo',
        alt: 'komité logo',
        standardStoreLocation: 'logo_simple.png',
        credit: null,
        license: null,
    },
    LOGO_SIMPLE: {
        name: 'logo_simple',
        alt: 'Logo',
        standardStoreLocation: 'logo_simple.png',
        credit: null,
        license: null,
    },
    LOGO_WHITE: {
        name: 'logo_white',
        alt: 'Logo',
        standardStoreLocation: 'logo_white.png',
        credit: null,
        license: null,
    },
    LOGO_WHITE_TEXT: {
        name: 'logo_white_text',
        alt: 'Logo',
        standardStoreLocation: 'omega_logo_white.png',
        credit: null,
        license: null,
    },
    MAGISK_HATT: {
        name: 'magisk_hatt',
        alt: 'Magisk hatt',
        standardStoreLocation: 'magisk_hatt.png',
        credit: null,
        license: null,
    },
    HOVEDBYGGNINGEN: {
        name: 'hovedbygningen',
        alt: 'Hovedbygningen',
        standardStoreLocation: 'hovedbygget.jpeg',
        credit: 'Thomas Høstad/NTNU',
        license: 'CC BY-SA 4.0',
        // https://ntnu.fotoware.cloud/fotoweb/archives/
        // 5005-Blinkskudd/Folder%20112/Hovedbygget-03.jpg.info#c=%2Ffotoweb%2Farchives%2F5005-Blinkskudd%2F
    },
    BOOKS: {
        name: 'Books',
        alt: 'Bøker',
        standardStoreLocation: 'books.jpeg',
        credit: 'Alexander Grey',
        license: 'Paxels',
    },
    MACHINE: {
        name: 'machine',
        alt: 'Maskin',
        standardStoreLocation: 'machine.jpeg',
        credit: 'Børge Sandnes/NTNU',
        license: 'CC BY-SA 4.0',
        // https://ntnu.fotoware.cloud/fotoweb/archives/
        // 5005-Blinkskudd/Folder%20112/Manu-08.jpg.info#c=%2Ffotoweb%2Farchives%2F5005-Blinkskudd%2F
    },
    REALFAGSBYGGET: {
        name: 'Realfagsbygget',
        alt: 'Realfagsbygget',
        standardStoreLocation: 'realfagsbygget.jpeg',
        credit: 'Per Henning/NTNU',
        license: 'CC BY-SA 4.0',
        // https://ntnu.fotoware.cloud/fotoweb/archives/
        // 5019-Campuser/Folder%20112/Realfagbygget-soloppgang-2015-2.jpg.info#c=%2Ffotoweb%2Farchives%2F5019-Campuser%2F
    },
    FAIR: {
        name: 'fair',
        alt: 'Fair',
        standardStoreLocation: 'fair.jpeg',
        credit: null,
        license: null,
        // From contactor
    }
} as const satisfies Record<StandardImage, {
    name: string
    alt: string
    standardStoreLocation: string
    credit: string | null
    license: StandardLicenseName | null
}>
