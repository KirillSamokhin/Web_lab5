import { Module } from '@nestjs/common';
import {BrokersModule} from "./brokers/brokers.module";
import {StocksModule} from "./stocks/stocks.module";

@Module({
  imports: [StocksModule, BrokersModule],
})

export class AppModule {}