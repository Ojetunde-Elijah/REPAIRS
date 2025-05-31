import {IsEnum, IsString, MaxLength} from "class-validator"

export class BaseNotificationDto {
    @IsEnum(["EMAIL", "SMS", "PUSH"])
    type: string

    @IsString()
    @MaxLength(2000)
    content: string

}