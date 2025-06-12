import {Module, Global} from "@nestjs/common";
import * as admin from "firebase-admin";

@Global()
@Module({
    providers: [
        {
            provide: "FIREBASE_ADMIN",
            useFactory: ()=>{
                if(admin.apps.length === 0){
                    return admin.initializeApp({
                        credential: admin.credential.cert({
                            privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
                            clientEmail: process.env.CLIENTEMAIL,
                            projectId: process.env.PROJECTID
                        } as Partial<admin.ServiceAccount>),
                        databaseURL: process.env.FIREBASE_DATABASE_URL
                    })
                }
            }
        }
    ]
})
export class FireBaseModule{}