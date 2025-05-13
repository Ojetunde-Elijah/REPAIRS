import { NestFactory } from '@nestjs/core';
import { NestApplicationOptions } from '@nestjs/common';
import { AppModule } from './app.module';

import * as admin from "firebase-admin"
import { SwaggerModule } from '@nestjs/swagger';
import { createDocument } from './swagger/swagger';
import { Logger } from './logger/logger';
import { ConfigService } from './config/config.service';
import * as dotenv from "dotenv"
import {resolve} from "path"
dotenv.config({ path: resolve(__dirname, '../.env') });
const configService = new ConfigService()
console.log(configService.getConfig())
console.log(process.env.PRIVATE_KEY)
console.log(process.env.MONGO_DB_URI)
const NEST_LOGGING = false
process.on("warning",(err)=>{
  console.error("Warning",err)
})
async function bootstrap() {
  const opts: NestApplicationOptions = { }
  if(!NEST_LOGGING){
    opts.logger = false
  }
  
  admin.initializeApp({
    credential: admin.credential.cert({
      privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.CLIENTEMAIL,
      projectId: process.env.PROJECTID,
    } as Partial<admin.ServiceAccount>),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  })
  console.log("Firebase has started")
  const app = await NestFactory.create(AppModule,opts);
  process.on("unhandledRejection",(err)=>{
    console.error("Unhandled Rejection",err)  
  })
  process.on("uncaughtException",(err)=>{
    console.error("Uncaught Exception",err)  
  })


  SwaggerModule.setup("api/v1",app,createDocument(app))
  await app.listen(process.env.PORT ?? 3000);
  console.log("App has started")
}
export default admin
bootstrap().catch((err)=>{
  console.error("Error starting app",err)
  process.exit(1)
});
