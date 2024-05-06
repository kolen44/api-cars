import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { NewscrudRoutesService } from 'src/newscrud_routes/newscrud_routes.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private NewsCrudService: NewscrudRoutesService) {
    super({ usernameField: 'telephone_number' });
  }

  async validate(telephone_number: string, password: string): Promise<any> {
    const user = await this.NewsCrudService.validateUser(
      telephone_number,
      password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
