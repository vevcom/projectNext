'use client'
import useOnNavigation from '@/hooks/useOnNavigation'
import styles from './SlideSidebar.module.scss'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faBeer, 
    faChild, 
    faKey, 
    faNewspaper, 
    faUser, 
    faUserGroup,
    faArrowLeft,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

const navigations = [
{
    header: {
        icon: faUser,
        title: 'Brukere'
    },
    links: [
        {
            title: 'Brukere',
            href: '/admin/users'
        }
    ],
},
{
    header: {
        icon: faNewspaper,
        title: 'CMS'
    },
    links: [
        {
            title: 'Rediger cms',
            href: '/admin/cms'
        }
    ],
},
{
    header: {
        icon: faBeer,
        title: 'Komitéer'
    },
    links: [
        {
            title: 'Opprett komité',
            href: '/admin/committees'
        }
    ],
},
{
    header: {
        icon: faChild,
        title: 'Opptak'
    },
    links: [
        {
            title: 'Phaestum',
            href: '/admin/phaestum'
        },
        {
            title: 'Opptak',
            href: '/admin/admission'
        },
        {
            title: 'Omegas tilstand',
            href: '/admin/stateOfOmega'
        }
    ],
},
{
    header: {
        icon: faUserGroup,
        title: 'Grupper'
    },
    links: [
        {
            title: 'Grupper',
            href: '/admin/groups'
        },
        {
            title: 'Klasser',
            href: '/admin/classes'
        }
    ],
},
{
    header: {
        icon: faKey,
        title: 'Tillgangsstyring'
    },
    links: [
        {
            title: 'Tillgangsroller',
            href: '/admin/permission-roles'
        },
        {
            title: 'Standard tillganger',
            href: '/admin/default-permissions'
        }
    ],
}
] satisfies {
    header: {
        icon: IconDefinition
        title: string
    },
    links: {
        title: string
        href: string
    }[]
}[]

type PropTypes = {
    currentPath: string
}

/**
 * Component that renders a sidebar that can be toggled on and off.
 * @param children - The children to render in the sidebar.
 * @returns 
 */
export default function SlideSidebar({ currentPath }: PropTypes) {
    const [open, setOpen] = useState(true)
    const previousPath = useRef<string>(currentPath)

    useOnNavigation(() => {
        console.log('currentPath', currentPath)
        if (previousPath.current === 'admin' && currentPath !== 'admin') {
            setOpen(false)
        }
        if (currentPath === 'admin') {
            setOpen(true)
        }
        previousPath.current = currentPath
    })

    const handleToggle = () => {
        setOpen(!open)
    }

    return (
        <div className={open ? `${styles.SlideSidebar} ${styles.open}` : `${styles.SlideSidebar} ${styles.closed}`}>
            <aside className={styles.sidebar}>
            {
                navigations.map(navigation => (
                    <>
                        <h3 className={styles.header}>
                            <FontAwesomeIcon icon={navigation.header.icon} />
                            {navigation.header.title}
                        </h3>
                        {
                            navigation.links.map(link => (
                                <Link key={link.title} href={link.href} className={link.href === `/admin/${currentPath}` ? styles.active : ''}>
                                    {link.title}
                                </Link>
                            ))
                        }
                    </>
                ))
            }
            </aside>
            <button onClick={handleToggle} className={styles.toggle}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
        </div>
    )
}
