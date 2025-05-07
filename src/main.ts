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
const NEST_LOGGING = false
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
  SwaggerModule.setup("api/v1",app,createDocument(app))
  await app.listen(process.env.PORT ?? 3000);
  console.log("App has started")
}
export default admin
bootstrap();
