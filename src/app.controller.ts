import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Get('*splat')
  serveClient(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  }
}
