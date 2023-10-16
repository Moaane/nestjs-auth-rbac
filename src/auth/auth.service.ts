import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt'
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService
    ) { }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { username: registerDto.username }
        })

        if (existingUser) {
            throw new UnauthorizedException("username already in use")
        }

        // if(registerDto.password.length < 6) {
        //     throw new BadRequestException("password is less than 6 characters")
        // }

        const hashedPassword = await bcrypt.hash(registerDto.password, 5)

        const user = await this.prisma.user.create({
            data: {
                ...registerDto,
                password: hashedPassword
            }
        })

        console.log(user)
        return user.username

    }

    async login(loginDto: LoginDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { username: loginDto.username }
        })

        if (!existingUser) {
            throw new NotFoundException("user not found")
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, existingUser.password)

        if (!isPasswordValid) {
            throw new UnauthorizedException("password is false")
        }

        const payload = { sub: existingUser.id, username: existingUser.username, role: existingUser.role }

        return {
            access_token: await this.jwt.signAsync(payload)
        }
    }
}
