import styles from './page.module.scss'
import { createThemeAction } from '@/actions/themes/create'
import { readThemesAction } from '@/actions/themes/read'
import Form from '@/app/_components/Form/Form'
import TextInput from '@/app/_components/UI/TextInput'
import ColorInput from '@/app/_components/UI/ColorInput'
import { updateThemeAction } from '@/actions/themes/update'
import { destroyThemeAction } from '@/actions/themes/destroy'
import Theme from '@/app/_components/Theme/Theme'

export default async function ThemesAdmin() {
    const res = await readThemesAction.bind(null, {})()
    if (!res.success) throw new Error('Kunne ikke hente temaer')
    const themes = res.data

    return (
        <div>
            <h1>Themes Admin</h1>
            <Form
                action={createThemeAction.bind(null, {})}
                submitText="Lag nytt tema"
            >
                <TextInput name="name" label="Navn" />
                <ColorInput name="primaryLight" label="Primærfarge lys" />
                <ColorInput name="primaryDark" label="Primærfarge mørk" />
                <ColorInput name="secondaryLight" label="Sekundærfarge lys" />
                <ColorInput name="secondaryDark" label="Sekundærfarge mørk" />
            </Form>

            <ul>
                {themes.map((theme) => (
                    <li key={theme.id}>
                       <Theme theme={theme}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}
