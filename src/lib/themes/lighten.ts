export function lighten(R: number, G: number, B: number, amount = 0.2): [number, number, number] {
    const RLight = R + (255 - R) * amount
    const GLight = G + (255 - G) * amount
    const BLight = B + (255 - B) * amount

    return [RLight, GLight, BLight]
}