import { Request } from 'express';
import { Users } from 'src/config/entity/user.entity';
export interface RequestWithUser extends Request {
  user: Users;
}
