import * as mongodb from "mongodb";

export interface Trade {
    timestamp: number;
    Asset_ID: number;
    Count:number;
    Open:number;
    High:number;
    Low:number;
    Close:number;
    Volume:number;
    VWAP: number;
    group_num: number;
    row_id: number;
}

