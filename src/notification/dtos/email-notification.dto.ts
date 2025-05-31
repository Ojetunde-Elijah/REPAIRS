import { BaseNotificationDto } from "./notification.dto";

export class EmailNotification extends BaseNotificationDto{
    @IsEmail()
    recipient: string;

    @IsString()
    @MaxLength(100)
    subject: string

    @IsBoolean()
    @IsOptional()
    isHtml?: boolean
}