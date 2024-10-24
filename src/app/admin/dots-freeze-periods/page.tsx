import styles from './page.module.scss'

export default function dotsFreezePeriods() {
    return (
        <div className={styles.wrapper}>
            <h1>Frysperioder for prikker</h1>
            <i>Dette er perioder der prikker ikke fjernes</i>
            <p>
                Merk at opprettelse og endring av frys-perioder IKKE vil påvirke når allerede utdelte prikker
                løper ut. Bare prikker som deles ut etter endringen vil påvirkes.
            </p>
        </div>
    )
}
