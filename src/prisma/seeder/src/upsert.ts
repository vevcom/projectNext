export async function upsert<ReturnCreate, ReturnUpdate>(
    config: {
        checkExistance: () => boolean,
        create: () => Promise<ReturnCreate>,
        update: () => Promise<ReturnUpdate>,
    }
): Promise<ReturnCreate | ReturnUpdate> {
    if (config.checkExistance()) {
        return await config.update()
    }
    return await config.create()
}
