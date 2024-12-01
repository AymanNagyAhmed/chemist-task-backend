import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TrailingSlashMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.url.length > 1 && req.url.endsWith('/')) {
      const query = req.url.slice(req.url.indexOf('?'));
      const urlWithoutSlash = req.url.slice(0, -1) + query;
      return res.redirect(301, urlWithoutSlash);
    }
    next();
  }
} 