import { BaseNotificationDto } from "./notification.dto";

export class SmsNotificationDto extends BaseNotificationDto{
    @IsE164Number()
    recipient: string;

    @IsString()
    @MaxLength(160)
    text: string
}