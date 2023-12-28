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
    return (
        <div>
            {
                image ? (
                    <Image image={image} width={width} {...props}/>
                ) : (
                    <NextImage src="/store/images/default_image.jpeg" width={width} alt="default image" {...props}/>
                )
            }
        </div>
    )
}
