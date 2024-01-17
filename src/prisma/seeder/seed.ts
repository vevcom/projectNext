import seedImages from "./seedImages";
import seedDevUsers from "./development/seedDevUsers";
import seedDevImages from "./development/seedDevImages";
import seedCms from "./seedCms";

export default async function seed() {
    console.log('seeding standard data....')
    await seedImages()
    await seedCms()
    console.log('seed standard done')

    if (process.env.NODE_ENV !== 'development') return
    console.log('seeding dev data....')
    await seedDevUsers();
    await seedDevImages();
    console.log('seed dev done')
}