import { NestFactory } from '@nestjs/core';
import { NestApplicationOptions } from '@nestjs/common';
import { AppModule } from './app.module';

import * as admin from "firebase-admin"
import { SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createDocument } from './swagger/swagger';
import helmet from "helmet"
// import { config } from "aws-sdk"
import { Logger } from './logger/logger';
import { ConfigService } from './config/config.service';
import * as dotenv from "dotenv"
import {resolve} from "path"
dotenv.config({ path: resolve(__dirname, '../.env') });
if(process.env.NODE_ENV === "production" || process.env.NODE_ENV === "development"){
  require("newrelic")
}
// const configService = new ConfigService()
// console.log(configService.getConfig())
// console.log(process.env.PRIVATE_KEY)
// console.log(process.env.MONGO_DB_URI)
const logger = new Logger(new ConfigService());
logger.debug('DEBUG TEST');
logger.log('LOG TEST');
logger.warn('WARN TEST');
logger.error('ERROR TEST');
const NEST_LOGGING = false
process.on("warning",(err)=> {
  console.error("Warning",err)
})
async function bootstrap() {
  // config.update({
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
  //   region: process.env.AWS_REGION
  // })
  const opts: NestApplicationOptions = { }
  if(!NEST_LOGGING){
    opts.logger = false
  }
  try {
    logger.log("Initializing Firebase...");
    admin.initializeApp({
      credential: admin.credential.cert({
        privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.CLIENTEMAIL,
        projectId: process.env.PROJECTID,
      } as Partial<admin.ServiceAccount>),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })
    logger.log("Firebase initialized successfully")

    logger.log("Creating Nest application")
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.disable("x-powered-by")
    app.enableCors();
    app.use(helmet())
    app.use(helmet.noSniff());
    app.use(helmet.hidePoweredBy());
    app.use(helmet.contentSecurityPolicy())
    
    process.on("unhandledRejection",(err)=>{
      logger.error("Unhandled Rejection")  
    })
    process.on("uncaughtException",(err)=>{
      logger.error("Uncaught Exception")  
    })

    logger.log("Setting up swagger...")
    SwaggerModule.setup("api/v1",app,createDocument(app))
    
    const port = process.env.PORT || 3000
    logger.log(`Starting server on port ${port}`)
    await app.listen(port);
    logger.log(`Application is running on: ${await app.getUrl()}`)
  }catch(err){
    if(err.code === "EADDRINUSE"){
      logger.error(`Port ${3000} is already in use`)
    }
    logger.log(`Bootstrap failed: ${err}`)
    process.exit(1)
  }
  }
export default admin
bootstrap()
