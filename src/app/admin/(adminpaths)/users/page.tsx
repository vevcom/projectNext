import create from '@/actions/users/create'
import TextInput from '@/app/components/UI/TextInput'
import Form from '@/app/components/Form/Form'

export default function Users() {
    return (
        <Form title="Create a user" createText="Create user" action={create}>
            <TextInput label="username" name="username" />
            <TextInput label="password" name="password" />
            <TextInput label="confirm password" name="confirmPassword" />
            <TextInput label="email" name="email" />
            <TextInput label="first name" name="firstname" />
            <TextInput label="last name" name="lastname" />
        </Form>
    )
}
