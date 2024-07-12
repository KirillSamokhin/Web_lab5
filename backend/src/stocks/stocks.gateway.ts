import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import * as jsonStocks from '../#data/stocks.json'
import * as fs from "fs";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})

export class StocksGateway {
    @WebSocketServer()
    private server: Server;
    private stocks: Stock[];
    private tradingStocks: TradingStock[] = [];
    private counterRowReading = 1;

    private isTradingWorking = false;
    private tradingStartDate: Date;
    private tradingIntervalId = null;

    constructor() {
        this.stocks = jsonStocks.stocks as unknown as Stock[]
    }

    @SubscribeMessage('stocks')
    findAll(): WsResponse<Stock[]> {
        return { event: 'stocks', data: this.stocks };
    }

    @SubscribeMessage('updateStock')
    changeTradeStatus(@MessageBody() newStock: Stock): WsResponse<string> {
        const stockIndex = this.stocks.findIndex(stock => stock.name === newStock.name);

        if (stockIndex !== -1) {
            this.stocks[stockIndex] = newStock;
            return { event: 'stockUpdateSuccess', data: 'Stock updated successfully' };
        } else {
            return { event: 'stockUpdateFailure', data: 'Stock not found' };
        }
    }

    @SubscribeMessage('getStartTradeDate')
    getStartTradeDate(): WsResponse<Date> {
        if (this.tradingStartDate) {
            return { event: 'getStartTradeDate', data: this.tradingStartDate };
        } else {
            return {event: 'getStartTradeDate', data: null}
        }
    }

    @SubscribeMessage('startTrading')
    startTrading(@MessageBody() [tickSeconds, totalSeconds, date]: [number, number, Date]): void {
        if (this.isTradingWorking || new Date(date).toLocaleDateString('ru') !== new Date().toLocaleDateString('ru')) {
            return;
        }
        this.tradingStartDate = new Date(date);
        console.log(this.tradingStartDate)
        this.server.emit('tradeStart');
        this.server.emit('getStartTradeDate', this.tradingStartDate as any);

        this.isTradingWorking = true;
        this.tradingIntervalId = setInterval(() => {
            for (const stock of this.stocks) {
                if (!stock.isTrading) continue;

                const lastDataPoint = stock.months[stock.months.length - 1];
                const lastDate = new Date(lastDataPoint.date);

                let nextMonth = lastDate.getMonth() + 1;
                let nextYear = lastDate.getFullYear();
                if (nextMonth == 12){
                    nextMonth = 0
                    nextYear += 1
                }

                // @ts-ignore
                const workbook = JSON.parse(fs.readFileSync(`C:\\Users\\Кирилл\\WebstormProjects\\lab5_nest\\backend\\src\\#data\\${stock.symbol}.json`));
                const price = workbook[this.counterRowReading].Open;

                this.counterRowReading += 1;

                stock.months.push({
                    date: `${String(nextMonth + 1).padStart(2, '0')}/01/${nextYear}`,
                    price: price.replace('$', '') as string,
                });
            }

            this.server.emit('updateStockData', this.stocks as any);

            totalSeconds -= tickSeconds;

            if (totalSeconds <= 0) {
                this.stopTrading();
            }
        }, tickSeconds * 1000);
    }

    private stopTrading() {
        if (this.tradingIntervalId) {
            this.server.emit('tradeEnd');

            clearInterval(this.tradingIntervalId);
            this.tradingStartDate = null;
            this.isTradingWorking = false;
            this.tradingIntervalId = null;
        }
    }

    @SubscribeMessage('getTradeStock')
    getTradeStock(): WsResponse<TradingStock[]> {
        console.log(this.tradingStocks)
        return { event: 'getTradeStock', data: this.tradingStocks };
    }

    @SubscribeMessage('addTradeStock')
    addTradeStock(@MessageBody() newStock: TradingStock): WsResponse<string> {
        if (newStock.stock.isTrading) {
            const existingTradingStock = this.tradingStocks.find(
                (tradingStock) => tradingStock.stock.symbol === newStock.stock.symbol
            );

            if (existingTradingStock) {
                existingTradingStock.amount += newStock.amount;
            } else {
                this.tradingStocks.push(newStock);
            }

            this.server.emit('getTradeStock', this.tradingStocks as any);

            return { event: 'addTradeStock', data: 'Success' };
        } else {
            return { event: 'addTradeStock', data: null };
        }
    }

    @SubscribeMessage('reduceTradeStock')
    reduceTradeStock(@MessageBody() newStock: TradingStock): WsResponse<string> {
        if (newStock.stock.isTrading) {
            const existingTradingStock = this.tradingStocks.find(
                (tradingStock) => tradingStock.stock.symbol === newStock.stock.symbol
            );

            existingTradingStock.amount -= newStock.amount;

            this.server.emit('getTradeStock', this.tradingStocks as any);

            return { event: 'reduceTradeStock', data: 'Success'};
        } else {
            return { event: 'reduceTradeStock', data: null };
        }
    }

    @SubscribeMessage('removeTradeStock')
    removeTradeStock(@MessageBody() symbol: string): WsResponse<string> {
        const index = this.tradingStocks.findIndex(tradingStock => tradingStock.stock.symbol === symbol);

        if (index !== -1) {
            this.tradingStocks.splice(index, 1);

            this.server.emit('getTradeStock', this.tradingStocks as any);

            return { event: 'removeTradeStock', data: `Акция с символом ${symbol} успешно удалена из списка торгующих` };
        } else {
            return { event: 'error', data: `Акция с символом ${symbol} не найдена в списке торгующих` };
        }
    }
}