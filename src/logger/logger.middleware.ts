import {Injectable,NestMiddleware} from "@nestjs/common"
import {Request,Response} from "express"
import * as moment from "moment";

import {Logger} from "./logger"

@Injectable()
export class LoggerMiddleware implements NestMiddleware<Request,Response>{
    public constructor(private readonly logger: Logger){}
    public use(req: Request, res: Response, next: () => void): any{
        const before = Date.now();
        next()

        res.on("close",()=>this.logger.http(this.generateLogMessage(req,res,Date.now()- before)))
    }

    private getResponseSize(res: Response):number{
        const sizeRaw = res.getHeader("Content-Length")
        if(typeof sizeRaw ==="number"){
            return sizeRaw
        }
        if(typeof sizeRaw ==="string"){
            return parseInt(sizeRaw,10)
        }
        return 0
    }

    private generateLogMessage(req: Request,res: Response,timeTaken:number):string{
        const responseSize = this.getResponseSize(res)
        const terms: { [key: string]: string } = {
            '%h': req.socket.remoteAddress || '-',
            '%l': '-',
            '%u': '-', // todo: parse req.headers.authorization?
            '%t': `[${moment().format('DD/MMM/YYYY:HH:mm:ss ZZ')}]`,
            '%r': `${req.method} ${req.originalUrl} ${req.httpVersion}`,
            '%>s': `${res.statusCode}`,
            '%b': responseSize === 0 ? '-' : `${responseSize}`,
          };
          let str = '%h %l %u %t \"%r\" %>s %b %{Referer}i %{User-agent}i';
          for (const term in terms) {
            if (term in terms) {
              str = str.replace(term, terms[term]);
            }
          }
          str = str.replace(/%\{([a-zA-Z\-]+)\}i/g, (match, p1) => {
            const header = req.headers[`${p1}`.toLowerCase()];
            if (header == null) { return '-'; }
            if (Array.isArray(header)) { return `"${header.join(',')}"`; }
            return `"${header}"`;
          });
          return str;
    }
}