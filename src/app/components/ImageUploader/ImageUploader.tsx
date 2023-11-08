import create from '@/actions/images/create'

export default function ImageUploader() {
    return (
        <form action={create}>
            <input type="file" name="file" />
            <input type="text" placeholder="name" name="name" />
            <input type="text" placeholder="alt" name="alt" />
            <button type="submit" value="Upload">Upload</button>
        </form>
    )
}
