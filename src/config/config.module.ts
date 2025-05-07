import {Module} from '@nestjs/common';

import {ConfigService} from "./config.service";

const configFactory = {
    provide: ConfigService,
    useFactory: () => {
        const configService = new ConfigService();
        configService.loadingUsingDotEnv();
        return configService;
    }
}

@Module({
    providers: [configFactory],
    exports: [configFactory]
})

export class ConfigModule{}
