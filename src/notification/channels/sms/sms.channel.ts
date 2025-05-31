import { Injectable } from "@nestjs/common";
import { NotificationChannel, NotificationType, NotificationResult } from "../../inteerfaces/notification.channel";

@Injectable()
export class SmsChannel implements NotificationChannel {
    supports(type: NotificationType): boolean{
        return type === "SMS";
    }

    async send(notification: any): Promise<NotificationResult>{
        try{
            console.log(`Sending SMS to ${notification.phoneNumber}: ${notification.message}`);
            return { success: true };
        } catch(error){
            return { success: false, error: error.message };
        }
    }
}