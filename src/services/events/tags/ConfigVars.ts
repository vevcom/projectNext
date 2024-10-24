import type { SpecialEventTags } from '@prisma/client'

export const SpecialEventTagsConfig = {
    COMPANY_PRESENTATION: {
        name: 'Bedpress',
        description: 'Bedpress',
        colorR: 255,
        colorG: 0,
        colorB: 0
    }
} satisfies Record<SpecialEventTags, {
    name: string;
    description: string;
    colorR: number;
    colorG: number;
    colorB: number;
}>
