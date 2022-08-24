import { Users } from "../../../../config/entity/user.entity";
import { Request } from 'express';

export interface RequestWithUser extends Request{
    user:Users;
}