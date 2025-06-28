import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

const SUPABASE_JWKS_URL = 'https://process.env.SUPABASE_PROJECTID.supabase.co/auth/v1/keys'; // Replace with your Supabase project URL

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private jwks: any = null;

  async getJwks() {
    if (!this.jwks) {
      const { data } = await axios.get(SUPABASE_JWKS_URL);
      this.jwks = data.keys;
    }
    return this.jwks;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('No token');
    const token = authHeader.split(' ')[1];

    // Decode token header to get kid
    const decoded: any = jwt.decode(token, { complete: true });
    if (!decoded) throw new UnauthorizedException('Invalid token');
    const kid = decoded.header.kid;

    // Get JWKS and find the right key
    const jwks = await this.getJwks();
    const jwk = jwks.find((key) => key.kid === kid);
    if (!jwk) throw new UnauthorizedException('Invalid token key');

    // Convert JWK to PEM
    const pubkey = jwk.x5c[0];
    const cert = `-----BEGIN CERTIFICATE-----\n${pubkey}\n-----END CERTIFICATE-----`;

    try {
      const payload = jwt.verify(token, cert, { algorithms: ['RS256'] });
      req.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
} 