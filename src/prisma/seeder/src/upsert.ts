import { Smorekopp } from '@/services/error'

export async function upsert<ReturnCreate, ReturnUpdate>(
    config: {
        checkExistance: () => Promise<boolean>,
        create: () => Promise<ReturnCreate>,
        update: () => Promise<ReturnUpdate>,
    }
): Promise<ReturnCreate | ReturnUpdate> {
    if (
        await config.checkExistance().catch(
            error => {
                if (error instanceof Smorekopp) {
                    if (error.errorCode === 'NOT FOUND') return false
                }
                throw error
            }
        )
    ) {
        return await config.update()
    }
    return await config.create()
}
