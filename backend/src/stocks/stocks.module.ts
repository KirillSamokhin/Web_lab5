import { Module } from '@nestjs/common';
import { StocksGateway } from './stocks.gateway';

@Module({
    providers: [StocksGateway],
})
export class StocksModule {}