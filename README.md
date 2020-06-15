# PRODEFI BLOCK EXPLORER WORKER
  The prodefi-block-explorer-worker that can run in NodeJS. It is based on TypeScript, JavaScript and Express.
  The project is using one of the most popular NoSQL database is MongoDB. Additional it is run node server with PM2. PM2 is a daemon process manager that will help you manage and keep your application online.
### Setup
- Checking out following guide to setup Nodejs: https://nodejs.org/en/download/
- Checking out following guide to setup MongoDB: https://docs.mongodb.com/manual/installation/
- Checking out following guide to setup PM2: https://pm2.keymetrics.io/
### Environment variables
- All environment variables is defined at ecosystem.config.js file:
    + PEAK_TPS: default peak tps. Peak tps is greater than or equal than 0. If the server is running, please note this current value before you stop it. Overwrite it before restarting again. (*******IT IS VERY IMPORTANT*******).
    + NODE_ENV: It have 2 value: development or production.
    + NODE_PORT: start the project at .... in server.
    + RPC_URL: (your tendermint swagger server).
    + DB_HOST: Ex: nmongodb://127.0.0.1:27017/ (your DB server).
    + DB_DATABASE: Ex: problockexplorer(your mongoDB name).
    + QUERY_MAX_LIMIT: default 25
    + SOCKET_ROOM: default ('LOBBY')
    + START_AT_LATEST: default: -1
    + START_AT_BLOCK: default: -1.
    + END_AT_BLOCK: default: 0. If the server is running, please note this current value before you stop it. Overwrite it before restarting again. It make the project ignore all block, txs from 0 to specific value is saved in DB. Ex: You write  END_AT_BLOCK is latest block height. The project only get infomation of new blocks, txs... from your RPC_URL from latest block height to future.
    
### Setup production
- Navigate to folder contains package.json file.
- Change enviroment variables at ecosystem.config.js file.
- Run command: yarn install or npm install
- Run command: yarn build or npm run build . The project will generate a folder name: dist
- Start project with pm2: pm2 start ecosystem.config.js --env production
- Stop project with pm2: pm2 stop prodefi-block-explorer-worker
- Delete project with pm2: pm2 delete prodefi-block-explorer-worker

### Advance PM2 command
- pm2 logs
- pm2 list