// @ts-ignore
import {WebSocketGateway, SubscribeMessage, MessageBody, WsResponse} from '@nestjs/websockets';
import * as jsonData from '../#data/brokers.json';
import { Broker } from './models/broker';
import {OwnedStock} from "./models/ownedStock";

@WebSocketGateway()
export class BrokersGateway {
    private readonly brokers: Broker[];

    constructor() {
        this.brokers = jsonData.brokers as unknown as Broker[];
    }

    @SubscribeMessage('brokers')
    findAll(): WsResponse<Broker[]> {
        return { event: 'brokers', data: this.brokers };
    }

    @SubscribeMessage('deleteBroker')
    deleteBroker(@MessageBody() name: string): WsResponse<string> {
        const brokerIndex = this.brokers.findIndex(broker => broker.name === name);

        if (brokerIndex !== -1) {
            this.brokers.splice(brokerIndex, 1);
            return { event: 'deleteBrokerSuccess', data: 'Broker deleted successfully' };
        } else {
            return { event: 'deleteBrokerFailure', data: 'Broker not found' };
        }
    }

    @SubscribeMessage('login')
    handleLogin(@MessageBody() loginData: string): WsResponse<Broker | string> {
        const name = loginData;
        const foundBroker = this.brokers.find(broker => broker.name === name);

        if (foundBroker) {
            return { event: 'loginSuccess', data: foundBroker };
        } else {
            return { event: 'loginFailure', data: 'Invalid username or password' };
        }
    }

    @SubscribeMessage('register')
    handleRegister(@MessageBody() newBroker: Broker): WsResponse<Broker | string> {
        const existingBroker = this.brokers.find(broker => broker.name === newBroker.name);

        if (existingBroker) {
            return { event: 'registerFailure', data: 'Username already exists' };
        } else {
            this.brokers.push(newBroker);
            return { event: 'registerSuccess', data: newBroker };
        }
    }

    @SubscribeMessage('updateInitialValue')
    updateInitialValue(@MessageBody() updateData: { name: string, initialValue: number }): WsResponse<Broker | string> {
        const { name, initialValue } = updateData;
        const brokerIndex = this.brokers.findIndex(broker => broker.name === name);

        if (brokerIndex !== -1) {
            this.brokers[brokerIndex].initialValue = updateData.initialValue;
            return { event: 'updateInitialValueSuccess', data: this.brokers[brokerIndex] };
        } else {
            return { event: 'updateInitialValueFailure', data: 'Broker not found' };
        }
    }

    @SubscribeMessage('updateBroker')
    updateBroker(@MessageBody() newBroker: Broker): WsResponse<string> {
        this.brokers.forEach(broker => {
            if (broker.name === newBroker.name) {
                Object.assign(broker, newBroker);
            }
        })

        return { event: 'updateBroker', data: 'success' };
    }
}