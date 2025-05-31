import {Injectable} from "@nestjs/common";
import {NotificationChannel, NotificationType, NotificationResult} from "../../inteerfaces/notification.channel";

@Injectable()
export class PushChannel implements NotificationChannel{
    supports(type: NotificationType): boolean {
        return type === "PUSH";
    }

    async send(notification: any): Promise<NotificationResult>{
        try{
            console.log(`Sending push to ${notification.deviceId}: ${notification.message}`);
            return {success: true};
        }catch(error){
            return { success: false, error: error.message}
        }
    }
}
