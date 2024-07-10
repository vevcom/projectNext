import styles from './page.module.scss'

export default function admission() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.soelle}>
                <h2>Soelle (avsky)</h2>
                <i>Hent alle soelle</i>
            </div>
            <div className={styles.externals}>
                <h2>Eksterne</h2>
                <i>Hent alle eksterne</i>
            </div>
            <div className={styles.noAffiliation}>
                <h2>Uten tilknytting</h2>
                <i>Hent brukere uten tilknyttning</i>
            </div>
            <div className={styles.multipeAffiliation}>
                <h2>Flere tilknyttninger</h2>
                <i>Hent brukere med flere tilknyttninger</i>
            </div>
            <div className={styles.members}>
                <h2>Medlemmer</h2>
                <i>Hent alle medlemmer av current orden</i>
            </div>
        </div>
    )
}
