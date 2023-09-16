import styles from './Section.module.scss'

function Section({}) {
  return (
    <div className={styles.section}>
        <Image width={400} src={kappemann}/>
        <div>
          <h3>Om Omega</h3>
          <p>
            Sct. Omega Broderskab ble offisielt stiftet 21. november 1919 av et kull elektrostudenter 
            som må ha hatt et svært godt kameratskap og sosialt miljø. Til å begynne med var det en 
            eksklusiv klubb forbeholdt 3. og 4. årskurs, og for å bli tatt opp måtte man sende inn 
            en fyldig søknad. Dette har endret seg gjennom årene, og i dag blir medlemmene tatt 
            opp automatisk fra 1. klasse.
          </p>
          <Link href="infopages/about">Les mer</Link>
        </div>
    </div>
  )
}

export default Section{}