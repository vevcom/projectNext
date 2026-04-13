import { readFile } from 'fs/promises'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { File } from 'node:buffer'
import type { StandardLicenseName } from '@/services/licenses/constants'

const standardStoreRoot = fileURLToPath(new URL('../../../standard_store/', import.meta.url))

const standardStoreFile = (location: string) => async (): Promise<File> => {
    const filePath = join(standardStoreRoot, location)
    const fileContents = await readFile(filePath)
    return new File([fileContents], location)
}

export type StandardStoreFile = {
    readFile: () => Promise<File>,
    credit: string | null,
    license: StandardLicenseName | null,
    originOfFile: URL | string
}

type StandardStoreFilesMap = {
    [key: string]: StandardStoreFile | Record<string, StandardStoreFile>
    devProfileImage: Record<string, StandardStoreFile>
}

export const standardStoreFiles = {
    defaultImage: {
        readFile: standardStoreFile('default_image.png'),
        credit: null,
        license: null,
        originOfFile: new URL('https://pixabay.com/vectors/image-media-icon-symbol-visual-2935360/'),
    },
    album: {
        readFile: standardStoreFile('album.jpeg'),
        credit: null,
        license: null,
        originOfFile: new URL('https://pixabay.com/photos/photos-nostalgia-retro-photography-7666143/'),
    },
    books: {
        readFile: standardStoreFile('books.jpeg'),
        credit: 'Alexander Grey',
        license: 'Paxels',
        originOfFile: new URL('https://www.pexels.com/photo/selective-focus-photo-of-pile-of-assorted-title-books-1148399/'),
    },
    fair: {
        readFile: standardStoreFile('fair.jpeg'),
        credit: null,
        license: null,
        originOfFile: 'From contractor',
    },
    harambe: {
        readFile: standardStoreFile('harambe.jpg'),
        credit: null,
        license: null,
        originOfFile: new URL('https://pixabay.com/photos/silverback-gorilla-male-gorilla-271002/'),
    },
    hovedbygget: {
        readFile: standardStoreFile('hovedbygget.jpeg'),
        credit: 'Thomas Høstad/NTNU',
        license: 'CC BY-SA 4.0',
        originOfFile: new URL('https://ntnu.fotoware.cloud/fotoweb/archives/'),
    },
    kongsberg: {
        readFile: standardStoreFile('kongsberg.png'),
        credit: null,
        license: null,
        originOfFile: 'Kongsberg Gruppen',
    },
    logoSimple: {
        readFile: standardStoreFile('logo_simple.png'),
        credit: null,
        license: null,
        originOfFile: 'ow - basic',
    },
    logoWhite: {
        readFile: standardStoreFile('logo_white.png'),
        credit: null,
        license: null,
        originOfFile: 'ow - basic',
    },
    machine: {
        readFile: standardStoreFile('machine.jpeg'),
        credit: 'Børge Sandnes/NTNU',
        license: 'CC BY-SA 4.0',
        originOfFile: 'https://ntnu.fotoware.cloud/fotoweb/archives/',
    },
    magiskHattWhite: {
        readFile: standardStoreFile('magisk_hatt_white.png'),
        credit: null,
        license: null,
        originOfFile: 'ow-basic',
    },
    magiskHatt: {
        readFile: standardStoreFile('magisk_hatt.png'),
        credit: null,
        license: null,
        originOfFile: 'ow-basic',
    },
    omegaLogoWhite: {
        readFile: standardStoreFile('omega_logo_white.png'),
        credit: null,
        license: null,
        originOfFile: 'ow - basic',
    },
    omegamai: {
        readFile: standardStoreFile('Omegamai.jpeg'),
        credit: null,
        license: null,
        originOfFile: 'ow - basic',
    },
    ov: {
        readFile: standardStoreFile('ov.jpeg'),
        credit: null,
        license: null,
        originOfFile: 'ow - basic',
    },
    pwa: {
        readFile: standardStoreFile('pwa.png'),
        credit: null,
        license: null,
        originOfFile: 'pwa logo',
    },
    realfagsbygget: {
        readFile: standardStoreFile('realfagsbygget.jpeg'),
        credit: 'Per Henning/NTNU',
        license: 'CC BY-SA 4.0',
        originOfFile: 'https://ntnu.fotoware.cloud/fotoweb/archives/',
    },
    treaty: {
        readFile: standardStoreFile('treaty.jpg'),
        credit: null,
        license: null,
        originOfFile: new URL('https://pixabay.com/photos/paper-document-old-writing-vintage-3212015/'),
    },
    vevcomLogo: {
        readFile: standardStoreFile('vevcom_logo.png'),
        credit: null,
        license: null,
        originOfFile: 'ow - basic',
    },
    kappemann: {
        readFile: standardStoreFile('kappemann.jpeg'),
        credit: null,
        license: null,
        originOfFile: 'ow - basic',
    },
    kappemannBronse: {
        readFile: standardStoreFile('kappemann_bronse.png'),
        credit: null,
        license: null,
        originOfFile: 'ow - basic',
    },
    kappemannDiamant: {
        readFile: standardStoreFile('kappemann_diamant.png'),
        credit: null,
        license: null,
        originOfFile: 'ow - basic',
    },
    kappemannGull: {
        readFile: standardStoreFile('kappemann_gull.png'),
        credit: null,
        license: null,
        originOfFile: 'ow - basic',
    },
    kappemannPaske: {
        readFile: standardStoreFile('kappemann_paske.png'),
        credit: null,
        license: null,
        originOfFile: 'ow - basic',
    },
    kappemannSolv: {
        readFile: standardStoreFile('kappemann_solv.png'),
        credit: null,
        license: null,
        originOfFile: 'ow - basic',
    },
    nordic: {
        readFile: standardStoreFile('nordic.png'),
        credit: null,
        license: null,
        originOfFile: 'nordic',
    },
    ohma: {
        readFile: standardStoreFile('ohma.jpeg'),
        credit: null,
        license: null,
        originOfFile: 'ow - basic',
    },
    devProfileImage: {
        Bjørn: {
            readFile: standardStoreFile('dev_profile_images/Bjørn.jpg'),
            credit: null,
            license: null,
            originOfFile: new URL('https://pixabay.com/photos/bear-head-brown-brown-bear-1283347/'),
        },
        Due: {
            readFile: standardStoreFile('dev_profile_images/Due.jpg'),
            credit: null,
            license: null,
            originOfFile: new URL('https://pixabay.com/photos/dove-bird-freedom-flying-pigeon-2680487/'),
        },
        Ekorn: {
            readFile: standardStoreFile('dev_profile_images/Ekorn.jpg'),
            credit: null,
            license: null,
            originOfFile: new URL('https://pixabay.com/photos/squirrel-attentive-ears-cute-619968/'),
        },
        Elefant: {
            readFile: standardStoreFile('dev_profile_images/Elefant.jpg'),
            credit: null,
            license: null,
            originOfFile: new URL('https://pixabay.com/photos/elephant-nature-wildlife-safari-9772462/'),
        },
        Frosk: {
            readFile: standardStoreFile('dev_profile_images/Frosk.jpg'),
            credit: null,
            license: null,
            originOfFile: new URL('https://pixabay.com/photos/tree-frog-frog-amphibian-nature-8600329/'),
        },
        Gås: {
            readFile: standardStoreFile('dev_profile_images/Gås.jpg'),
            credit: null,
            license: null,
            originOfFile: new URL('https://pixabay.com/photos/goose-wild-goose-water-bird-bird-3477674/'),
        },
        Hest: {
            readFile: standardStoreFile('dev_profile_images/Hest.jpg'),
            credit: null,
            license: null,
            originOfFile: new URL('https://pixabay.com/photos/horse-wild-horse-sligo-ireland-8542469/'),
        },
        Kanin: {
            readFile: standardStoreFile('dev_profile_images/Kanin.jpg'),
            credit: null,
            license: null,
            originOfFile: new URL('https://pixabay.com/photos/eastern-cottontail-wild-rabbit-9604011/'),
        },
        Løve: {
            readFile: standardStoreFile('dev_profile_images/Løve.png'),
            credit: null,
            license: null,
            originOfFile: new URL('https://pixabay.com/photos/lion-feline-mane-barbary-lion-8096155/'),
        },
        Papegøye: {
            readFile: standardStoreFile('dev_profile_images/Papegøye.jpg'),
            credit: null,
            license: null,
            originOfFile: new URL('https://pixabay.com/photos/bird-parrot-ornithology-species-1823839/'),
        },
        Påfugl: {
            readFile: standardStoreFile('dev_profile_images/Påfugl.jpg'),
            credit: null,
            license: null,
            originOfFile: new URL('https://pixabay.com/photos/peacock-bird-multicoloured-poultry-2479685/'),
        },
        Rev: {
            readFile: standardStoreFile('dev_profile_images/Rev.jpg'),
            credit: null,
            license: null,
            originOfFile: new URL('https://pixabay.com/photos/fox-animal-wilderness-nature-2597803/'),
        },
        Sjiraff: {
            readFile: standardStoreFile('dev_profile_images/Sjiraff.jpg'),
            credit: null,
            license: null,
            originOfFile: new URL('https://pixabay.com/photos/flower-giraffe-giraffe-look-giraffe-6553711/'),
        },
        Skilpadde: {
            readFile: standardStoreFile('dev_profile_images/Skilpadde.jpg'),
            credit: null,
            license: null,
            originOfFile: new URL('https://pixabay.com/photos/turtle-tortoise-shell-terrestrial-4277518/'),
        },
        Slange: {
            readFile: standardStoreFile('dev_profile_images/Slange.jpg'),
            credit: null,
            license: null,
            originOfFile: new URL('https://pixabay.com/photos/green-tree-python-python-snake-9295182/'),
        },
        Ugle: {
            readFile: standardStoreFile('dev_profile_images/Ugle.jpg'),
            credit: null,
            license: null,
            originOfFile: new URL('https://pixabay.com/photos/boobook-owl-little-owl-staring-owl-1655548/'),
        },
        Ørn: {
            readFile: standardStoreFile('dev_profile_images/Ørn.jpg'),
            credit: null,
            license: null,
            originOfFile: new URL('https://pixabay.com/photos/adler-eagle-bird-white-tailed-eagle-2386314/'),
        },
    }
} as const satisfies StandardStoreFilesMap
