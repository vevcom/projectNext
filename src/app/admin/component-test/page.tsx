'use client'
import styles from './page.module.scss'
import Button from '@/components/UI/Button'
import BorderButton from '@/components/UI/BorderButton'
import SubmitButton from '@/components/UI/SubmitButton'
import TextInput from '@/components/UI/TextInput'
import Textarea from '@/components/UI/Textarea'
import Checkbox from '@/components/UI/Checkbox'
import DateInput from '@/components/UI/DateInput'
import Slider from '@/components/UI/Slider'
import FileInput from '@/components/UI/FileInput'
import ProgressBar from '@/components/ProgressBar/ProgressBar'

const textInputColors = ['primary', 'secondary', 'red', 'black', 'white'] as const
const sliderColors = ['primary', 'secondary', 'red', 'black', 'white'] as const
const fileInputColors = ['primary', 'secondary', 'red', 'black'] as const

export default function ComponentTest() {
    return (
        <div className={styles.wrapper}>
            <h1>Komponenter</h1>
            <p>Et lite utvalg av komponenter som finnes på veven.</p>

            <section className={styles.section}>
                <h2>Buttons</h2>
                <div className={styles.row}>
                    <Button color="primary">Primary</Button>
                    <Button color="secondary">Secondary</Button>
                    <Button color="green">Green</Button>
                    <Button color="red">Red</Button>
                    <Button color="secondary" disabled>Disabled</Button>
                </div>
                <div className={styles.row}>
                    <BorderButton color="primary">Border primary</BorderButton>
                    <BorderButton color="secondary">Border secondary</BorderButton>
                </div>
                <form className={styles.row}>
                    <SubmitButton color="primary" success={false}>Submit</SubmitButton>
                    <SubmitButton color="green" success={true}>Success</SubmitButton>
                </form>
            </section>

            <section className={styles.section}>
                <h2>Text inputs</h2>
                <div className={styles.row}>
                    {textInputColors.map(color => (
                        <TextInput key={color} name={`text_${color}`} label={color} color={color} />
                    ))}
                </div>
                <div className={styles.row}>
                    <Textarea name="textarea_demo" label="Textarea" />
                </div>
                <div className={styles.row}>
                    <DateInput name="date_demo" label="Date" />
                    <DateInput name="datetime_demo" label="Date and time" includeTime />
                </div>
            </section>

            <section className={styles.section}>
                <h2>Checkbox and sliders</h2>
                <div className={styles.row}>
                    <Checkbox name="checkbox_demo_1" label="Unchecked" />
                    <Checkbox name="checkbox_demo_2" label="Checked" defaultChecked />
                    <Checkbox name="checkbox_demo_3" label="Disabled" disabled />
                </div>
                <div className={styles.row}>
                    {sliderColors.map(color => (
                        <Slider key={color} name={`slider_${color}`} label={color} color={color} />
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2>File input</h2>
                <div className={styles.row}>
                    {fileInputColors.map(color => (
                        <FileInput key={color} name={`file_${color}`} label={color} color={color} />
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2>Progress bar</h2>
                <div className={styles.column}>
                    <ProgressBar progress={0.25} />
                    <ProgressBar progress={0.5} />
                    <ProgressBar progress={0.9} />
                </div>
            </section>
        </div>
    )
}
