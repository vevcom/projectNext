import create from '@/actions/users/create'
import TextInput from '@/app/components/UI/TextInput'
import Button from '@/UI/Button'

export default function Users() {
    return (
        <div>
            <h2>Users</h2>
            <form action={create}>
                <TextInput label="username" name="username" />
                <TextInput label="password" name="password" />
                <TextInput label="confirm password" name="confirmPassword" />
                <TextInput label="email" name="email" />
                <TextInput label="first name" name="firstname" />
                <TextInput label="last name" name="lastname" />
                <Button type="submit" value="Upload">Create user</Button>
            </form>
        </div>
    )
}
