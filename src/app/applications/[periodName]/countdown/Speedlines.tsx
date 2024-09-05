import styles from './Speedlines.module.scss';

export default function Speedlines() {
    const lines = Array.from({ length: 80 });

    return (
        <div className={styles.container}>
            {lines.map((_, index) => {
                const randomRotate = Math.random() * 360; // Random rotation between 0 and 360 degrees
                const randomDelay = Math.random() * 2; // Random delay between 0 and 2 seconds
                const randomLength = Math.random() * 100 - 50; // Random length between -50 and 50

                return (
                    <svg
                        key={index}
                        className={styles.speedline}
                        viewBox="0 0 100 100"
                        style={{
                            '--rotate': `${randomRotate}deg`,
                            '--delay': `${randomDelay}s`,
                        } as React.CSSProperties}
                    >
                        <line x1="50" y1="50" x2="50" y2={randomLength} />
                    </svg>
                );
            })}
        </div>
    );
}