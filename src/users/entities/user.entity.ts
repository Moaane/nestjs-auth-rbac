import { $Enums, user as UserModel } from "@prisma/client";

export class UserEntity implements UserModel {
    id: string;
    username: string;
    password: string;
    role: $Enums.Role;
}
