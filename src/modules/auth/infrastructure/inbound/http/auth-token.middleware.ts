import { NextFunction, Request, Response } from 'express';
import { TokenDecoderPort } from '@modules/auth/application/ports/outbound/token-decoder.port';
import { TokenPayload } from '@modules/auth/domain/models/token-payload.model';

declare global {
  namespace Express {
    interface Request {
      decoded?: TokenPayload;
    }
  }
}

export type AuthTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

export function makeAuthTokenMiddleware(
  tokenDecoder: TokenDecoderPort<TokenPayload>,
): AuthTokenMiddleware {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { authorization } = req.headers;

    if (!authorization) {
      res.status(401).json({ error: 'Token not provided' });
      return;
    }

    const [, token] = authorization.split(' ');

    if (!token) {
      res.status(401).json({ error: 'Token not provided' });
      return;
    }

    try {
      req.decoded = tokenDecoder.decode(token);
      next();
    } catch {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}
