import { BaseNotificationDto } from "./notification.dto";
import {IsEmail, IsString, MaxLength,IsBoolean,IsOptional} from "class-validator"
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