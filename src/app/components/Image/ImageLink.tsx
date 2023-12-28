import Image from "./Image"
import { default as NextImage, ImageProps } from "next/image"

type PropTypes = Omit<ImageProps, 'src' | 'alt'> & { 
    name: string,
    width: number,
    alt?: string
}

export default async function ImageLink({name, width, alt, ...props}: PropTypes) {
    const image = await prisma.image.findUnique({
        where: { name }
    })
    const default_image = await prisma.image.findUnique({
        where: { name: "default_image" }
    })
    if (!default_image) throw new Error("No default image found")
    return (
        <div>
            {
                image ? (
                    <Image image={image} width={width} {...props}/>
                ) : (
                    <Image image={default_image} width={width} {...props}/>
                )
            }
        </div>
    )
}
