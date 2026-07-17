import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: any, res: any, next: NextFunction) {
        const time = new Date().toISOString();
        console.log(`${req.method} ${req.url} ${time}`);
        next();
    }
}