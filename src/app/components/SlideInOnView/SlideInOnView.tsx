'use client'
import { useEffect, useRef } from 'react';
import styles from './SlideInOnView.module.scss';

type PropTypes = {
    children: React.ReactNode
}

export default function SlideInOnView({children}: PropTypes) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    ref.current?.classList.add(styles.visible);
                }
            },
            {
                threshold: 0.1,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div ref={ref} className={styles.SlideInOnView}>{children}</div>
    );
}
