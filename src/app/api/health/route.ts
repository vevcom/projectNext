// Liveness endpoint for container orchestration (Docker healthcheck, Dokploy, Coolify, ...).
// Deliberately dependency-free (no DB/session access) so it reflects only whether the
// Next.js server itself is up and responding.
export function GET() {
    return new Response('OK', { status: 200 })
}
