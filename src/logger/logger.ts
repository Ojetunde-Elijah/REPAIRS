import {Injectable, LoggerService} from "@nestjs/common";
import * as moment from "moment";
import {MESSAGE} from "triple-beam"
import * as winston from "winston"

import { ConfigService } from "../config/config.service";
// import { isLogLevel } from "./loglevel";
import { Loglevel,isLogLevel } from "./loglevel";

const formatter = winston.format((info)=>{
    if(info.level === Loglevel.Http){
        return info
    }
    info.message = `[${moment().format('ddd MMM DD HH:mm:ss YYYY')}] [${info.level}] ${info.message}`;
    return info
});

    const passthrough = winston.format((info)=>{
        info[MESSAGE] = info.message
        return info
    })
@Injectable()
export class Logger implements LoggerService{
    private logger: winston.Logger;

    constructor (private configService: ConfigService){
        this.logger = winston.createLogger({
          level: configService.getConfig().logLevel,
            format: formatter()
        })

        this.logger.add(new winston.transports.Console({
            format: passthrough(),
            stderrLevels: [Loglevel.Error, Loglevel.Warn]
        }))

    }

    public log(log:Loglevel,message: string):void
    public log(message:string):void

    public log(p0: Loglevel | string, p1?:string){
        const logLevel = isLogLevel(p0) ? p0 : Loglevel.Info;
        const message = (isLogLevel(p0) && p1) ?p1:p0;
        this.logger.log(logLevel, message)
    }

    public error(message:string){
        this.log(Loglevel.Error,message)
    }

    public debug(message:string){
        this.log(Loglevel.Debug,message)
    }
    public warn(message:string){
        this.log(Loglevel.Warn,message)
    }
    public info(message:string){
        this.log(Loglevel.Info,message)
    }
    public verbose(message:string){
        this.log(Loglevel.Verbose,message)
    }
    public http(message:string){
        this.log(Loglevel.Http,message)
    }
    public silly(message:string){
        this.log(Loglevel.Silly,message)
    }

}