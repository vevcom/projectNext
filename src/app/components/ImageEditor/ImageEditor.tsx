import Image from "@/components/Image/Image"

type PropTypes = {
    name: string
}


export default function ImageEditor({name} : PropTypes) {
    return (
        <div>
            Edit Image {name}
            <Image showEditOption={false} width={200} name={name} />
        </div>
    )
}