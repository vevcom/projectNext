'use client'
import Image from "@/app/_components/Image/Image"
import useInterval from "@/hooks/useInterval"
import { Image as ImageT } from "@prisma/client"
import { useRef, useState } from "react"
import styles from './CommitteeLogoRoll.module.scss'
import { set } from "zod"

type PropTypes = {
    committees: {
        shortname: string,
        logo: ImageT
    }[]
}

export default function CommitteeLogoRoll({ committees } : PropTypes) {
    const [currentCommitteeIndexes, setCurrentCommitteeIndexes] = useState({
        display1: 0,
        display2: 1,
        display3: 2,
    });

    const display1Ref = useRef<HTMLDivElement>(null);
    const display2Ref = useRef<HTMLDivElement>(null);
    const display3Ref = useRef<HTMLDivElement>(null);

    const [toggle, setToggle] = useState<1 | 2 | 3>(1);

    useInterval(() => {
        if (!committees.length) return;

        const currentIndex = Math.max(currentCommitteeIndexes.display1 ?? 0, currentCommitteeIndexes.display2 ?? 0);
        const nextIndex = (currentIndex + 1) % committees.length;

        let display : keyof typeof currentCommitteeIndexes = 'display1'
        let nextToggle = toggle;
        switch (toggle) {
            case 1:
                display = 'display1';
                nextToggle = 2;
                display1Ref.current?.classList.remove(styles.animate);
                setTimeout(() => display1Ref.current?.classList.add(styles.animate), 50);
                break;
            case 2:
                display = 'display2';
                nextToggle = 3;
                display2Ref.current?.classList.remove(styles.animate);
                setTimeout(() => display2Ref.current?.classList.add(styles.animate), 50);
                break;
            case 3:
                display = 'display3';
                nextToggle = 1;
                display3Ref.current?.classList.remove(styles.animate);
                setTimeout(() => display3Ref.current?.classList.add(styles.animate), 50);
                break;
        }
        
        setCurrentCommitteeIndexes({
            ...currentCommitteeIndexes,
            [display]: nextIndex,
        })

        setToggle(nextToggle);
    }, 2500);

    return (
        <div className={styles.CommitteeLogoRoll}>
            {currentCommitteeIndexes.display1 !== null && (
                <div ref={display1Ref} className={styles.display}>
                    <Image width={600} image={committees[currentCommitteeIndexes.display1].logo} />
                    <span>{committees[currentCommitteeIndexes.display1].shortname}</span>
                </div>
            )}
            {currentCommitteeIndexes.display2 !== null && (
                <div ref={display2Ref} className={styles.display}>
                    <Image width={600} image={committees[currentCommitteeIndexes.display2].logo} />
                    <span>{committees[currentCommitteeIndexes.display2].shortname}</span>
                </div>
            )}
            {currentCommitteeIndexes.display3 !== null && (
                <div ref={display3Ref} className={styles.display}>
                    <Image width={600} image={committees[currentCommitteeIndexes.display3].logo} />
                    <span>{committees[currentCommitteeIndexes.display3].shortname}</span>
                </div>
            )}
        </div>
    );
}
