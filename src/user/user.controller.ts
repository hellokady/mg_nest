import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register.dto';
import { QueryDto } from './dto/query.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  login(@Body() user: LoginDto) {
    return this.userService.login(user);
  }

  @Post('/register')
  register(@Body() user: RegisterDto) {
    return this.userService.register(user);
  }

  @Get()
  findAll(@Query() query: QueryDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: LoginDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch()
  batchUpdateRoles() {
    return this.userService.batchUpdateUserRoles();
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }
}
