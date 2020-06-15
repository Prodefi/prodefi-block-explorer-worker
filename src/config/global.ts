import { config } from 'dotenv';
import axios from "axios";
config();

export const env = {
    QUERY_MAX_PAGE: process.env.MAX_LAST_PAGE ? parseInt(process.env.MAX_LAST_PAGE) : 10000,
    QUERY_MAX_LIMIT: process.env.QUERY_MAX_LIMIT ? parseInt(process.env.QUERY_MAX_LIMIT) : 25,

    PEAK_TPS: process.env.PEAK_TPS ? parseInt(process.env.PEAK_TPS) : 0,
    NODE_ENV: process.env.NODE_ENV || 'development',
    NODE_PORT: process.env.NODE_PORT || 8059,
    RPC_URL: process.env.RPC_URL,
    DB_HOST: process.env.DB_HOST || "",
    DB_DATABASE: process.env.DB_DATABASE || "",
    SOCKET_ROOM: process.env.SOCKET_ROOM || "LOBBY",
    START_AT_LATEST: -1,
    START_AT_BLOCK:  process.env.START_AT_BLOCK ? parseInt(process.env.START_AT_BLOCK) : -1,
    END_AT_BLOCK: process.env.END_AT_BLOCK ? parseInt(process.env.END_AT_BLOCK) : 0,

}

// global axios default timeout. The request will wait 5 seconds before timing out
axios.defaults.timeout = 5000;

export enum ContractEventType {
    DEPOSITED = 1,
    WITHDRAW  = 2,
    REFUND    = 3
}