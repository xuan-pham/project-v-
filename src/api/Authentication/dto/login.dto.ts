import { Request } from 'express';
import { Users } from "src/config/entity/user.entity";

export class LogInDto extends Request {
    user: Users
}