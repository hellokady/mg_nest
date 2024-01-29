import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsWhere,
  In,
  Like,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

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

  @Inject(JwtService)
  private jwtService: JwtService;

  private logger = new Logger();

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
      name: '普通用户',
    });
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
      relations: {
        roles: true,
      },
      select: {
        id: true,
        password: true,
        roles: {
          id: true,
        },
      },
    });

    if (!foundUser) {
      throw new HttpException('该用户不存在', HttpStatus.ACCEPTED);
    }

    if (foundUser.password !== user.password) {
      throw new HttpException('密码错误', HttpStatus.ACCEPTED);
    }

    const token = this.jwtService.sign({
      user: {
        id: foundUser.id,
        roles: foundUser.roles,
      },
    });

    return token;
  }

  async findAll(queryDto: QueryDto) {
    const { page = 1, pageSize = 20, username, roles } = queryDto;

    const where: FindOptionsWhere<User> = {};
    if (username) {
      where.username = Like(`%${username}%`);
    }
    if (roles) {
      const formatRoles: number[] = JSON.parse(roles);
      if (Array.isArray(formatRoles) && formatRoles.length > 0) {
        where.roles = {
          id: In(formatRoles),
        };
      }
    }

    const query: FindManyOptions<User> = {
      where,
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
    const [users, total] = await this.userRepository.findAndCount(query);

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
    await this.userRepository.update(id, updateUserDto);
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
    await this.userRepository.softDelete(id);
    return '删除成功';
  }
}
