import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RequireLogin, RequirePermission } from 'src/common/decorators/custom.decorator';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @RequireLogin()
  @RequirePermission([])
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @RequireLogin()
  @RequirePermission(['普通用户-读取权限'])
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
