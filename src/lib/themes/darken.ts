export function darken(R: number, G: number, B: number, amount = 0.2): [number, number, number] {
    const RDark = R - R * amount
    const GDark = G - G * amount
    const BDark = B - B * amount

    return [RDark, GDark, BDark]
}