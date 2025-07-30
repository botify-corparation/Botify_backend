import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GuardsService implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token yoq');
    }

    const token = authHeader.split(' ')[1];
    let payload: any;

    try {
      const secret = process.env.JWT_SECRET
      payload = await this.jwtService.verifyAsync(token, { secret: secret });
    } catch (err) {
      console.log(err);

      throw new UnauthorizedException('Token notogri yoki muddati tugagan');
    }

    const currentAgent = request.headers['user-agent'] || 'unknown';
    const currentIp = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    console.log('Token ichidagi agent:', payload.agent)
    console.log('Request agent:', request.headers['user-agent'])

    if (payload.agent !== currentAgent || payload.ip !== currentIp) {
      throw new UnauthorizedException('Qurilma yoki IP mos emas');
    }

    request.user = payload;

    return true;
  }
}
