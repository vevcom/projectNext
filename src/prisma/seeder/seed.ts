import seedImages from "./seedImages";

export default async function seed() {
    console.log('seeding standard data....')
    await seedImages()

    console.log('seed standard done')
    if (process.env.NODE_ENV !== 'development') return
    console.log('seeding dev data....')

    console.log('seed dev done')
}