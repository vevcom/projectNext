import { ReactNode } from 'react';
import styles from './UserProfileSettingsCard.module.scss'

export default function UserProfileSettingsCard({children} : {children:ReactNode}) {
    return (
        <div className={styles.settingsCard}>
            {children}
        </div>
    );
}