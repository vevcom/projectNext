import ImageUploader from '@/components/ImageUploader/ImageUploader'
import prisma from '@/prisma'

export default async function Images() {
    const collections = await prisma.imageCollection.findMany()
    return (
        <>
            <ImageUploader />
            <h3>Hvad der har blivet fotografert</h3>
            {
                collections.map((collection) => (
                    <div key={collection.id}>
                        <h4>{collection.name}</h4>            
                    </div>
                ))
            }
        </>
    )
}
