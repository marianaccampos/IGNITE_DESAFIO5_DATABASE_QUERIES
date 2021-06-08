import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.games", "game")
      .where("users.id = :id", { id: user_id })
      .getOne();
    
    if (!user) {
      throw new Error("User does not exists!");
    }
    
    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("SELECT * FROM users ORDER BY first_name"); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`SELECT * FROM users WHERE first_name ILIKE '${first_name}' and last_name ILIKE '${last_name}' `); // Complete usando raw query
  }
}
