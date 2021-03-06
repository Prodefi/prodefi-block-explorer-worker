
import { json, Router } from "express";
import express from "express";

import helmet from "helmet";
import compression from 'compression';
import cors from 'cors';
import { registerApiRoutes } from "./routes";
import { registerRoutine } from "./routine";
import swaggerJsdoc from "swagger-jsdoc"; 
import swaggerUi from "swagger-ui-express";
import { env } from "./config/global";
import { swaggerDocument } from "./swagger/document";
import { createServer } from 'http';
import txServiceInstance from "./vendor/transaction";
import { TimeUtility } from "./util/time-util";
import  cache from 'memory-cache'

const options = {
    swaggerDefinition: {
      info: {
        title: 'Test API',
        version: '1.0.0',
        description: 'Test Express API with autogenerated swagger doc',
      },
    },
    basePath: '/api/v1',
    supportedSubmitMethods: ['get', 'post', 'put', 'delete'],
    apis: ['endpoints.js'],
  };

const specs = swaggerJsdoc(options);

export class Server {
    private readonly router: express.Application = express();
    public constructor() {
        const prefix: string = '/api/v1';
        
        // if (env.NODE_ENV === 'development') {
        //     this.router.use('/swagger/index.html', swaggerUi.serve, swaggerUi.setup(specs));
        //     this.router.get('/swagger/index.html', swaggerUi.setup(swaggerDocument, undefined, options, '.swagger-ui .topbar { background-color: red }'));
        // }
        this.router.use('/swagger/index.html', swaggerUi.serve, swaggerUi.setup(specs));
        this.router.get('/swagger/index.html', swaggerUi.setup(swaggerDocument, undefined, options, '.swagger-ui .topbar { background-color: red }'));


        registerMiddleware(this.router);
        registerApiRoutes(this.router, prefix);
        registerRoutine();
        repairMemCache();
    }

    public get server() : any {
        return createServer(this.router);
    }
}

export function registerMiddleware(router: Router): void {
    // router.use(cors());
    router.use(helmet());
    router.use(json());
    router.use(compression());
}

export function repairMemCache(){
  cache.clear();
  const now = new Date()
  const memCacheKeyBeginToday = now.getFullYear().toString()
        .concat("-")
        .concat((now.getMonth() + 1).toString())
        .concat("-").concat(now.getDay().toString()) 
        .concat("_").concat(now.getHours().toString()).concat("H")
        .concat("_UTC_addresses")
  
  txServiceInstance.getSetSenderAndReceipentToDate(TimeUtility.getBeginTodayUTC()).then(res => {
      let setAddress = new Set(res);
      cache.put(memCacheKeyBeginToday, setAddress);
  })
 
}