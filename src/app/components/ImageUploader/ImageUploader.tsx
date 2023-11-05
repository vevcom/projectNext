import create from '@/app/actions/images/create'

export default function ImageUploader() {
    return (
        <form action={create}>
            <input type="file" name="file" />
            <input type="text" name="name" />
            <button type="submit" value="Upload">Upload</button>
        </form>
    )
}
