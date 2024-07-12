export interface Broker {
    name: string,
    initialValue: number,
    ownedStocks: {
        symbol: string,
        amount: number,
        spendMoney: number
    }[]
}