import {Module} from "@nestjs/common"
import {EmailModule} from "./emails/email.module"
import {SmsChannelModule} from "./sms/sms.module"
import {PushChannelModule} from "./push/push.module"

@Module({
    imports: [EmailModule, SmsChannelModule, PushChannelModule],
    exports: [EmailModule, SmsChannelModule, PushChannelModule]
})

export class NotificationModule {
    // This module aggregates all notification channels (email, SMS, push).
    // It can be imported into other modules that require notification capabilities.
}