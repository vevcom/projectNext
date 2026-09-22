import cliProgress from 'cli-progress'

/**
 * Creates and starts a console progress bar for a dobbelOmega migration step.
 * Returns a no-op-ish bar (total 0) when there is nothing to migrate, so callers
 * can unconditionally call .increment()/.stop() without checking the count themselves.
 */
export function createProgressBar(label: string, total: number) {
    const bar = new cliProgress.SingleBar({
        format: `${label.padEnd(28)} |{bar}| {value}/{total} ({percentage}%) | ETA: {eta}s`,
        barCompleteChar: '█',
        barIncompleteChar: '░',
        hideCursor: true,
    })
    bar.start(total, 0)
    return bar
}
