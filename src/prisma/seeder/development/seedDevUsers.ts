export default async function seedDevUsers() {
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
}