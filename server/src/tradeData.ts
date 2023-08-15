import * as mongodb from "mongodb";

export interface TradeData {
    name: string;
    amount: number;
    price: number;
    type: string;
}
