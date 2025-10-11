export function isBuildPhase(): boolean {
    return process.env.NEXT_PHASE === 'phase-production-build'
}
