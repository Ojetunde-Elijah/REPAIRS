import {Module} from "@nestjs/common";
import {SmsChannel} from "./sms.channel";

@Module({
    providers: [SmsChannel],
    exports: [SmsChannel]
})

export class SmsChannelModule {
    // This module provides the SMS channel for notifications.
    // It can be imported into other modules that require SMS notification capabilities.
}