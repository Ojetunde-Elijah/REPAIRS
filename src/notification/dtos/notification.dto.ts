export class BaseNotificationDto {
    @IsEnum(["EMAIL", "SMS", "PUSH"])
    type: string

    @IsString()
    @MaxLength(2000)
    content: string

}