import { Module } from '@nestjs/common';
import {BrokersGateway} from './brokers.gateway';

@Module({
    providers: [BrokersGateway],
})
export class BrokersModule {}