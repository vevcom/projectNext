import styles from './page.module.scss'
import create from '@/actions/users/create'
import TextInput from '@/components/UI/TextInput'
import Form from '@/components/Form/Form'
import { v4 as uuid } from 'uuid'

export default function Users() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.createUser}>
                <Form title="Create a user" submitText="Create user" action={create}>
                    <TextInput label="username" name="username" key={uuid()}/>
                    <TextInput label="password" name="password" key={uuid()}/>
                    <TextInput label="confirm password" name="confirmPassword" key={uuid()}/>
                    <TextInput label="email" name="email" key={uuid()}/>
                    <TextInput label="first name" name="firstname" key={uuid()}/>
                    <TextInput label="last name" name="lastname" key={uuid()}/>
                </Form>
            </div>
        </div>


    )
}
