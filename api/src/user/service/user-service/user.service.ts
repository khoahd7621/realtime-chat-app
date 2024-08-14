import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Like, Repository } from 'typeorm';

import { AuthService } from 'src/auth/service/auth.service';
import { UserEntity } from 'src/user/model/user.entity';
import { UserI } from 'src/user/model/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async create(newUser: UserI): Promise<UserI> {
    try {
      const exists: boolean = await this.mailExists(newUser.email);
      if (!exists) {
        const passwordHash: string = await this.authService.hashPassword(
          newUser.password,
        );
        newUser.password = passwordHash;
        const savedUser = await this.userRepository.save(newUser);
        delete savedUser.password;
        return savedUser;
      } else {
        throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
      }
    } catch (error) {
      throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<UserI>> {
    return paginate<UserEntity>(this.userRepository, options);
  }

  async findAllByUsername(username: string): Promise<UserI[]> {
    return this.userRepository.find({
      where: {
        username: Like(`%${username}%`),
      },
    });
  }

  // Refactor to use JWT in next commit
  async login(user: UserI): Promise<string> {
    try {
      const foundUser: UserI = await this.findByEmail(user.email.toLowerCase());
      if (foundUser) {
        const passwordMatches: boolean =
          await this.authService.comparePasswords(
            user.password,
            foundUser.password,
          );
        if (passwordMatches) {
          delete foundUser.password;
          return this.authService.generateJwt(foundUser);
        } else {
          throw new HttpException(
            'Login was not successfull, wrong credentials',
            HttpStatus.UNAUTHORIZED,
          );
        }
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  // Also returns the password
  private async findByEmail(email: string): Promise<UserI> {
    return this.userRepository.findOne({
      where: {
        email,
      },
      select: ['id', 'email', 'username', 'password'],
    });
  }

  public async getOne(id: number): Promise<UserI> {
    return this.userRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  private async mailExists(email: string): Promise<boolean> {
    const user: UserI = await this.findByEmail(email);
    if (user) return true;
    else return false;
  }
}
