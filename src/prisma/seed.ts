import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import { join } from 'path'
const prisma = new PrismaClient()

async function main() {
    console.log('seed starting...')
    const standardCollection = await prisma.imageCollection.upsert({
        where: {
            name: 'standard_images'
        },
        update: {

        },
        create: {
            name: 'standard_images',
            description: 'standard images for the website',
        }
    })
    fs.readdir(join(__dirname, 'standard_images'), (err, files) => {
        if (err) throw err
        files.forEach(async (file) => {
            const ext = file.split('.')[1]
            if (!['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return console.log(`skipping image ${file}`)
            const name = file.split('.')[0]
            const image = await prisma.image.upsert({
                where: {
                    name
                },
                update: {

                },
                create: {
                    name,
                    alt: name.split('_').join(' '),
                    fsLocation: `${name}.${ext}`,
                    ext,
                    collection: {
                        connect: {
                            id: standardCollection.id
                        }
                    }
                }
            })
            return await prisma.cmsImage.upsert({
                where: {
                    name
                },
                update: {

                },
                create: {
                    name,
                    image: {
                        connect: {
                            id: image.id
                        }
                    },
                }
            })
        })
    })

    //seeding test data
    if (process.env.NODE_ENV !== 'development') return
    await prisma.user.upsert({
        where: {
            email: 'harambe@harambesen.io'
        },
        update: {

        },
        create: {
            firstname: 'Harambe',
            lastname: 'Harambesen',
            email: 'harambe@harambesen.io',
            password: 'password',
            username: 'Harambe104',
        },
    })
    for (let i = 0; i < 10; i++) {
        await prisma.imageCollection.upsert({
            where: {
                name: `test_collection_${i}`
            },
            update: {

            },
            create: {
                name: `test_collection_${i}`,
                description: 'just a test',
            }
        })
    }
}
main().then(async () => {
    await prisma.$disconnect()
    console.log('seed finished')
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    throw Error('seeding failed.... container closing')
})
