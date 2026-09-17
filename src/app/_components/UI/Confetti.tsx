'use client'
import canvasConfetti from 'canvas-confetti'

type ConfettiArguments = {
    angle?: number,
    spread?: number,
    duration?: number
    colors?: string[],
    particleCount?: number,
    origin?: { x: number, y: number },
}

/**
 * Summons confetti :)
 */
export function confetti({
    angle = 90,
    spread = 150,
    duration = 1000,
    colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff',],
    particleCount = 10,
    origin = { x: 0.5, y: 1 }
}: ConfettiArguments = {}) {
    const end = Date.now() + duration;

    (function frame() {
        canvasConfetti({
            particleCount,
            angle,
            spread,
            origin,
            colors,
        })

        if (Date.now() < end) {
            requestAnimationFrame(frame)
        }
    }())
}
