import {Injectable} from "@nestjs/common"
import Twilio from "twilio";

@Injectable()
export class SmsService {
    private client: Twilio.Twilio

    constructor(){
        this.client = Twilio(
            process.env.TWILIO_SID,
            process.env.TWILIO_AUTH_TOKEN
        )
        
    }
}