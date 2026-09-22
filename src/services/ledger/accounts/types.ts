// NOTE: `amount` and `fees` are stored as integers representing
// hundredths (1/100) of a Klinguende Meunt.
// (We should have a name for this. "Klinguende Cent"? "Klinguende Meuntling"?)
export type Balance = {
    amount: number,
    fees: number,
}

// TODO: Should this also be partial? It cannot possibly contain all number IDs.
export type BalanceRecord = Record<number, Balance>
