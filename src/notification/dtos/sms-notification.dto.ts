import { BaseNotificationDto } from "./notification.dto";
import { IsNumber } from "class-validator";
import { IsString, MaxLength } from "class-validator";
export class SmsNotificationDto extends BaseNotificationDto{
    @IsNumber()
    recipient: string;

    @IsString()
    @MaxLength(160)
    text: string
}