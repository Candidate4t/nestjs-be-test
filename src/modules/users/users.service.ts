import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { IAppConfig } from 'config/app.config';
import { IMongoConfig } from 'config/mongo.config';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService<
      IAppConfig & IMongoConfig,
      true
    >,
    @InjectModel(User.name) private readonly mongooseModel: Model<User>,
  ) {}

  getModel(): Model<User> {
    return this.mongooseModel;
  }

  async findWithFilters(queryUserDto: QueryUserDto): Promise<User[]> {
    const {sort, sortBy, page, limit, ...filter} = queryUserDto;
    
    filter.isDeleted = false; // Only return non-soft deleted users
    const query = this.mongooseModel.find(filter);
    if (sort && sortBy) {
      query.sort({ [sortBy]: sort });
    }
    
    if (page && limit) {
      query.skip((page - 1) * limit).limit(limit);
    }
    
    return query.exec()
        .then((users) => users)
        .catch((error) => {
            throw new Error(`Error while fetching users: ${error}`);
        });
  }

  async bulk_create(users: any[]): Promise<User[]> {
    const sanitized_users = []
    users.forEach((user) => {
        const { provider, ...rest } = user;
        
        sanitized_users.push({
            ...rest,
            marketingSource: provider
        });
    });

    return this.mongooseModel.insertMany(sanitized_users, { ordered: false })
      .then((result) => result)
      .catch((error) => {
        throw new Error(`Error while bulk creating users: ${error}`);
      });
  }
}
