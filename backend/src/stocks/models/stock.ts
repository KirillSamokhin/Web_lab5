interface Stock {
    name: string,
    symbol:string,
    isTrading: boolean,
    historicalData: string,
    months: {
        date: string,
        price: string
    }[]
}