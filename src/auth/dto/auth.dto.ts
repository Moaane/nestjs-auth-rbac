import { OmitType } from "@nestjs/mapped-types";
import { UserEntity } from "src/users/entities/user.entity";

export class RegisterDto extends OmitType(UserEntity, []) {
    username: string
    password: string
}

export class LoginDto extends OmitType(UserEntity, []) {
    username: string
    password: string
}