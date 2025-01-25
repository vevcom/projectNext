import { ServiceMethod } from '@/services/ServiceMethod'
import 'server-only'
import { readBookingsAuther } from '@/services/cabin/authers'
import { bookingFilerSelection } from './ConfigVars'

export const readCabinAvailability = ServiceMethod({
    auther: () => readBookingsAuther.dynamicFields({}),
    method: async ({ prisma }) => {
        const results = await prisma.booking.findMany({
            select: bookingFilerSelection,
            orderBy: {
                start: 'asc'
            },
            where: {
                canceled: null,
                end: {
                    gte: new Date(),
                },
            },
        })

        // Anonymize the bookings a bit
        for (let i = results.length - 1; i > 0; i--) {
            if (results[i].start === results[i - 1].end) {
                results[i - 1].end = results[i].end
                results.splice(i)
            }
        }

        return results
    }
})
