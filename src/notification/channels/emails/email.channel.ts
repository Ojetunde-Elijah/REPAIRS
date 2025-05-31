import {Injectable} from "@nestjs/common";
import { NotificationChannel, NotificationType,NotificationResult } from "../../inteerfaces/notification.channel";

@Injectable()

export class EmailChannel implements NotificationChannel {
    supports(type: NotificationType): boolean {
        return type === "EMAIL";
    }

    async send(notification: any): Promise<NotificationResult>{
        return {success: true}   
    }
}
