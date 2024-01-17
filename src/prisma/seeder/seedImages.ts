import prisma from ".."
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import { join } from 'path'

export default async function seedImages() {
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
                    fsLocation: uuid(),
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
}