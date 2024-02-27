//This file defines all the routes for the navbar and menu
//Higher placment in array gives hight priority on where it is placed (ie menu vs. navbar)
//does not include / or /login (or profile route) as they are always shown and ar special
import {
    faGamepad,
    faBook,
    faPoo,
    faShoppingCart,
    faComment,
    faQuestionCircle,
    faCamera,
    faList,
    faCircleInfo,
    faNewspaper,
    faCalendar,
    faSuitcase,
    faAddressCard,
    faBeer,
    faBriefcase,
    faGraduationCap,
    faTools,
    faChartLine,
    faSignature,
} from '@fortawesome/free-solid-svg-icons'
import type {
    IconDefinition } from '@fortawesome/free-solid-svg-icons'

type showTypes = 'all' | 'loggedOut' | 'loggedIn' | 'applicationPeriodAndLoggedIn' | 'admin'
export type NavItem = {
    name: string,
    href: string,
    show: showTypes,
    icon: IconDefinition,
}

export const itemsForMenu: NavItem[] = [
    {
        name: 'Hvad der hender',
        href: '/events',
        show: 'loggedIn',
        icon: faCalendar,
    },
    {
        name: 'Komitéer',
        href: '/committees',
        show: 'all',
        icon: faBeer,
    },
    {
        name: 'Jobbannonser',
        href: '/jobads',
        show: 'loggedIn',
        icon: faBriefcase,
    },
    {
        name: 'Søknader',
        href: '/applications',
        show: 'applicationPeriodAndLoggedIn',
        icon: faAddressCard,
    },
    {
        name: 'For Bedrifter',
        href: '/contactor',
        show: 'loggedOut',
        icon: faSuitcase,
    },
    {
        name: 'Ny Student?',
        href: '/articles',
        show: 'loggedOut',
        icon: faGraduationCap,
    },
    {
        name: 'Ombul',
        href: '/ombul',
        show: 'all',
        icon: faBook,
    },
    {
        name: 'Nyheter',
        href: '/news',
        show: 'all',
        icon: faNewspaper
    },
    {
        name: 'Bulshit',
        href: '/bulshit',
        show: 'all',
        icon: faPoo,
    },
    {
        name: 'Omegashop',
        href: '/money/shop',
        show: 'loggedIn',
        icon: faShoppingCart,
    },
    {
        name: 'Omegaquotes',
        href: '/omegaquotes',
        show: 'loggedIn',
        icon: faComment,
    },
    {
        name: 'Artikkler',
        href: '/articles',
        show: 'all',
        icon: faSignature,
    },
    {
        name: 'Guider',
        href: '/articles/guider',
        show: 'all',
        icon: faQuestionCircle,
    },
    {
        name: 'Bilder',
        href: '/images',
        show: 'all',
        icon: faCamera,
    },
    {
        name: 'Klasselister',
        href: '/userlist',
        show: 'loggedIn',
        icon: faList,
    },
    {
        name: 'Om Omega',
        href: '/articles/om%20omega',
        show: 'all',
        icon: faCircleInfo,
    },
    {
        name: 'Omegafond',
        href: '/omegafund',
        show: 'all',
        icon: faChartLine,
    },
    {
        name: 'Intressegrupper',
        href: '/infopages/interessegrupper',
        show: 'all',
        icon: faGamepad,
    },
    {
        name: 'Admin',
        href: '/admin',
        show: 'admin',
        icon: faTools,
    }
]

export default function getNavItems(loggedIn: boolean, admin: boolean, applicationPeiod: boolean): NavItem[] {
    return itemsForMenu.filter(item => {
        switch (item.show) {
            case 'all':
                return true
            case 'loggedOut':
                return !loggedIn
            case 'loggedIn':
                return loggedIn
            case 'applicationPeriodAndLoggedIn':
                return loggedIn && applicationPeiod
            case 'admin':
                return admin
            default:
                //item.show should be of type never
                return true
        }
    })
}
