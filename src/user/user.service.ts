import { HttpException, Injectable, Logger } from '@nestjs/common';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login-dto';
import { QueryDto } from './dto/query.dto';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  private logger = new Logger();
  private loginedUsers = new Map<number, User>();

  async register(user: RegisterDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      throw new HttpException('用户已存在', 200);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = user.password;
    const normalRole = await this.roleRepository.findOneBy({
      name: '普通用户'
    })
    newUser.roles = [normalRole];

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (error) {
      this.logger.error(error, this.register);
      return '注册失败';
    }
  }

  async login(user: LoginDto) {
    const foundUser = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
      select: ['id', 'password'],
    });

    if (!foundUser) {
      throw new HttpException('该用户不存在', 200);
    }

    if (foundUser.password !== user.password) {
      throw new HttpException('密码错误', 200);
    }

    this.loginedUsers.set(foundUser.id, foundUser);
    return {
      message: '登录成功',
      id: foundUser.id,
    };
  }

  async findAll(queryDto: QueryDto) {
    const { page = 1, pageSize = 20, username } = queryDto;

    const query: FindManyOptions<User> = {
      where: {
        username: username ? Like(`%${username}%`) : null,
      },
      relations: {
        roles: true,
      },
      select: {
        roles: {
          name: true,
        },
      },
      order: {
        createTime: 'desc',
      },
      skip: (+page - 1) * +pageSize,
      take: +pageSize,
    };
    const users = await this.userRepository.find(query);
    const total = await this.userRepository.count(query);
    return {
      page: +page,
      pageSize: +pageSize,
      total,
      data: users,
    };
  }

  async findOne(id: number) {
    const foundUser = await this.userRepository.findOneBy({
      id,
    });
    return foundUser;
  }

  async update(id: number, updateUserDto: LoginDto) {
    if (!this.loginedUsers.has(id)) {
      throw new HttpException('请登录后再进行操作', 200);
    }
    await this.userRepository.update(id, updateUserDto);
    this.loginedUsers.delete(id);
    return '更新成功';
  }

  async batchUpdateUserRoles() {
    const normalRole = await this.roleRepository.findOne({
      where: {
        name: '普通用户',
      },
    });
    const users = await this.userRepository.find();

    for (const user of users) {
      user.roles = [normalRole];
      await this.userRepository.save(user);
    }

    return '批量更新用户角色成功';
  }

  async remove(id: number) {
    console.log(this.loginedUsers, id);

    if (!this.loginedUsers.has(id)) {
      throw new HttpException('请登录后再进行操作', 200);
    }
    await this.userRepository.softDelete(id);
    this.loginedUsers.delete(id);
    return '删除成功';
  }
}
