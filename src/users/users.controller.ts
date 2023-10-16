import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  //buat role kalau ini harus ditetapin dia role apa aja yang bisa masuk, kalau untuk guest nanti di kosongin aja berarti
  //ini contoh kalau 2 2 nya bisa masuk tapi guest ga bisa, karena dia ga punya role
  
  // @Roles(Role.USER) ini buat user only
  // @Roles(Role.ADMIN) ini buat admin only
  @Roles(Role.USER, Role.ADMIN) // ini buat 2 2 nya kalau semua bisa mending gausah dipake
  @UseGuards(AuthGuard, RolesGuard) //kalau ga dipake hilangin aja roleguard nya atau dia bakal error
  @Get()
  findAll() {
    // const userid = req.user.sub
    // console.log(userid)
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
