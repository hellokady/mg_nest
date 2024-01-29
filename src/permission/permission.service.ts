import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  async create(createPermissionDto: CreatePermissionDto) {
    await this.permissionRepository.insert(createPermissionDto);
    return '创建成功';
  }

  async findAll() {
    const [permissions, total] = await this.permissionRepository.findAndCount({
      order: {
        createTime: 'desc',
      },
    });

    return {
      total,
      data: permissions,
    };
  }

  async findOne(id: number) {
    const permission = await this.permissionRepository.findOneBy({
      id,
    });
    return permission;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
