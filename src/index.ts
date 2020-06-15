import { env } from './config/global';
import { Server } from './server';
import "reflect-metadata";
import mongoose from 'mongoose';
import { logger } from './config/logger';
import { initSocket } from './socket';


mongoose.set('useCreateIndex', true);

const mongooseOptions = {
  autoIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const connect = () => {
  mongoose.connect(
    env.DB_HOST + env.DB_DATABASE,
    mongooseOptions,
  )
    .then(() => {

      // Init express server
      const server = new Server().server;

      // Start express server
      server.listen(env.NODE_PORT);

      initSocket(server);

      // finish init
      server.on('listening', () => {
        logger.info(`MONITOR-OBSERVER-NODE server is listening on port ${env.NODE_PORT} in ${env.NODE_ENV} mode`)
      });

      server.on('close', () => {
        logger.info('Server closed');
      });
    })
    .catch(err => {
      console.log(err);
    })
}

connect();
mongoose.connection.on('disconnected', connect);
