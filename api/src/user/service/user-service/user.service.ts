import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { from, map, Observable, switchMap } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { UserEntity } from 'src/user/model/user.entity';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  create(newUser: UserI): Observable<UserI> {
    return this.mailExists(newUser.email).pipe(
      switchMap((exists: boolean) => {
        if (!exists) {
          return this.authService.hashPassword(newUser.password).pipe(
            switchMap((passwordHash: string) => {
              // overwriter the user password with the hash, to store the hash in the database
              newUser.password = passwordHash;
              return from(this.userRepository.save(newUser)).pipe(
                switchMap((user: UserI) => this.findOne(user.id)),
              );
            }),
          );
        } else {
          throw new HttpException(
            'Email is already in use',
            HttpStatus.CONFLICT,
          );
        }
      }),
    );
  }

  findAll(options: IPaginationOptions): Observable<Pagination<UserI>> {
    return from(paginate<UserEntity>(this.userRepository, options));
  }

  // Refactor to use JWT in next commit
  login(user: UserI): Observable<string> {
    return this.findByEmail(user.email).pipe(
      switchMap((foundUser: UserI) => {
        if (foundUser) {
          return this.authService
            .comparePasswords(user.password, foundUser.password)
            .pipe(
              switchMap((matches: boolean) => {
                if (matches) {
                  return this.findOne(user.id).pipe(
                    switchMap((user: UserI) =>
                      this.authService.generateJwt(user),
                    ),
                  );
                } else {
                  throw new HttpException(
                    'Login was not successfull, wrong credentials',
                    HttpStatus.UNAUTHORIZED,
                  );
                }
              }),
            );
        } else {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
      }),
    );
  }

  // Also returns the password
  private findByEmail(email: string): Observable<UserI> {
    return from(
      this.userRepository.findOne({
        where: {
          email,
        },
        select: ['id', 'email', 'username', 'password'],
      }),
    );
  }

  private findOne(id: number): Observable<UserI> {
    return from(
      this.userRepository.findOne({
        where: {
          id,
        },
      }),
    );
  }

  private mailExists(email: string): Observable<boolean> {
    return from(
      this.userRepository.findOne({
        where: {
          email,
        },
      }),
    ).pipe(
      map((user: UserI) => {
        if (user) return true;
        else return false;
      }),
    );
  }
}
