import Input from '@/app/components/Input/Input'
import styles from './page.module.scss'
import magiskHatt from "@/images/magisk_hatt.png"
import Image from 'next/image'
import PrimaryButton from '@/app/components/PrimaryButton/PrimaryButton'
import Checkbox from '@/app/components/Checkbox/Checkbox'

function LogIn() {
  return (
    <div className={styles.wrapper}>
        <div className={styles.card}>
            <form className={styles.form} action="javasciprt:void(0);">
                <Input label="E-post"/>
                <Input label="Passord" type="password"/>

                <Checkbox label="Husk meg"></Checkbox>

                <PrimaryButton text="Logg inn"></PrimaryButton>
            </form>
            <div className={styles.image}>
                <Image width={200 } src={magiskHatt} />
            </div>
        </div>
    </div>
  )
}

export default LogIn