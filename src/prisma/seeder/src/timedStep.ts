import logger from '@/lib/logger'

function formatDuration(ms: number): string {
    return ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`
}

// Wraps logger.info so seed steps don't repeat `if (enabled) logger.info(...)` and takes the time of each step.
export function createTimedStep(enabled: boolean) {
    const start = performance.now()

    const log = (message: string) => {
        if (enabled) logger.info(message)
    }

    const step = async <ReturnValue>(label: string, seed: () => Promise<ReturnValue>): Promise<ReturnValue> => {
        log(`${label}...`)
        const stepStart = performance.now()
        const result = await seed()
        log(`Finished ${label.toLocaleLowerCase()} in ${formatDuration(performance.now() - stepStart)}.`)
        return result
    }

    const finish = () => {
        log(`Seeded everything in ${formatDuration(performance.now() - start)}.`)
    }

    return { log, step, finish }
}
