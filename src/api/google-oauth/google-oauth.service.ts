import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../Authentication/auth.service';
import { UserService } from '../user/user.service';

@Injectable()
export class GoogleOauthService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  async googleLogin(request) {
    return this.createAccountGoogle(request.user);
  }

  private async createAccountGoogle(data) {
    if (!data) {
      throw new BadRequestException();
    }
    const { email } = data;
    const user = await this.userService.findByEmail(email);
    if (user) {
      return this.authService.logIn(user);
    }

    try {
      const newUser = await this.userService.createWithGoogle(data);
      return this.authService.logIn(newUser);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
