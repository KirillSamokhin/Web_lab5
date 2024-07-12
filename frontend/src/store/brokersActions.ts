import {Broker} from "../models/Broker";

export const updateCapital = (broker: Broker) => ({
    type: 'UPDATE_CAPITAL',
    payload: broker,
});