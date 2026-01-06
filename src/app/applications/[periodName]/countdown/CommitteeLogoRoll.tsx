'use client'
import styles from './CommitteeLogoRoll.module.scss'
import Image from '@/app/_components/Image/Image'
import useInterval from '@/hooks/useInterval'
import { readNumberOfApplicationsAction } from '@/services/applications/periods/actions'
import { useRef, useState } from 'react'
import type { Image as ImageT } from '@prisma/client'

type PropTypes = {
    committees: {
        shortName: string,
        logo: ImageT
    }[],
    periodName: string
}

export default function CommitteeLogoRoll({ committees, periodName }: PropTypes) {
    const [currentCommitteeIndexes, setCurrentCommitteeIndexes] = useState<
        {
            display1: number | 'Søkere',
            display2: number | 'Søkere',
            display3: number | 'Søkere',
        }
    >({
        display1: 0,
        display2: 1,
        display3: 2,
    })

    const sokere = useRef(0)

    useInterval(async () => {
        const res = await readNumberOfApplicationsAction({ params: { name: periodName } })
        if (!res.success) return
        sokere.current = res.data
    }, 2000)

    const display1Ref = useRef<HTMLDivElement>(null)
    const display2Ref = useRef<HTMLDivElement>(null)
    const display3Ref = useRef<HTMLDivElement>(null)

    const currentIndex = useRef<number | 'Søkere'>(0)

    const [toggle, setToggle] = useState<1 | 2 | 3>(1)

    useInterval(() => {
        if (!committees.length) return

        let nextIndex: number | 'Søkere' = 0
        if (currentIndex.current === committees.length - 1) {
            nextIndex = 'Søkere'
        } else if (currentIndex.current === 'Søkere') {
            nextIndex = 0
        } else {
            nextIndex = currentIndex.current + 1
        }

        let display: keyof typeof currentCommitteeIndexes = 'display1'
        let nextToggle = toggle
        switch (toggle) {
            case 1:
                display = 'display1'
                nextToggle = 2
                display1Ref.current?.classList.remove(styles.animate)
                setTimeout(() => display1Ref.current?.classList.add(styles.animate), 50)
                break
            case 2:
                display = 'display2'
                nextToggle = 3
                display2Ref.current?.classList.remove(styles.animate)
                setTimeout(() => display2Ref.current?.classList.add(styles.animate), 50)
                break
            case 3:
                display = 'display3'
                nextToggle = 1
                display3Ref.current?.classList.remove(styles.animate)
                setTimeout(() => display3Ref.current?.classList.add(styles.animate), 50)
                break
            default:
                break
        }

        setCurrentCommitteeIndexes({
            ...currentCommitteeIndexes,
            [display]: nextIndex,
        })

        currentIndex.current = nextIndex
        setToggle(nextToggle)
    }, 2500)

    return (
        <div className={styles.CommitteeLogoRoll}>
            {currentCommitteeIndexes.display1 !== null && (
                <div ref={display1Ref} className={styles.display}>
                    {
                        currentCommitteeIndexes.display1 === 'Søkere' ? (<>
                            <h1>Søknader Hittil</h1>
                            <h1>{sokere.current}</h1>
                        </>) : (
                            <Display
                                image={committees[currentCommitteeIndexes.display1].logo}
                                shortName={committees[currentCommitteeIndexes.display1].shortName}
                            />
                        )
                    }
                </div>
            )}
            {currentCommitteeIndexes.display2 !== null && (
                <div ref={display2Ref} className={styles.display}>
                    {
                        currentCommitteeIndexes.display2 === 'Søkere' ? (<>
                            <h1>Søknader Hittil</h1>
                            <h1>{sokere.current}</h1>
                        </>) : (
                            <Display
                                image={committees[currentCommitteeIndexes.display2].logo}
                                shortName={committees[currentCommitteeIndexes.display2].shortName}
                            />
                        )
                    }
                </div>
            )}
            {currentCommitteeIndexes.display3 !== null && (
                <div ref={display3Ref} className={styles.display}>
                    {
                        currentCommitteeIndexes.display3 === 'Søkere' ? (<>
                            <h1>Søkere</h1>
                            <h1>{sokere.current}</h1>
                        </>) : (
                            <Display
                                image={committees[currentCommitteeIndexes.display3].logo}
                                shortName={committees[currentCommitteeIndexes.display3].shortName}
                            />
                        )
                    }
                </div>
            )}
        </div>
    )
}


function Display({ image, shortName }: { image: ImageT, shortName: string }) {
    return (
        <>
            <Image width={600} image={image} />
            <span>{shortName}</span>
        </>
    )
}
