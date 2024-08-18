import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { diskStorage } from 'multer';
import { ParseMongoObjectIdPipe } from 'src/pipes/parse-mongo-object-id.pipe';
import { CsvParser } from 'src/providers/csv-parser.provider';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadUsersResponseDto } from './dto/upload-users-response.dto';
import { UsersInterceptor } from './interceptors/users.interceptor';
import { User } from './schema/user.schema';
import { UsersService } from './users.service';
import { PaginatedResponseDto } from 'src/modules/users/dto/paginated-response.dto';

@ApiTags('Users API')
@Controller('users')
@UseInterceptors(UsersInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  @ApiOperation({ summary: `Create a new user` })
  @ApiOkResponse({ type: User })
  async postUsers(@Body() body: CreateUserDto): Promise<User> {
      return await this.usersService.getModel().create(body);
  }

  @Get('/')
  @ApiOperation({ summary: `Return a list of non soft deleted users` })
  @ApiOkResponse({ type: PaginatedResponseDto<User> })
  async getUsers(@Query() query: QueryUserDto): Promise<PaginatedResponseDto<User>> {
    const users = await this.usersService.findWithFilters(query);
    return  new PaginatedResponseDto<User>({
        data: users,
        limit: query.limit,
        page: query.page,
        sort: query.sort,
        sortBy: query.sortBy,
    });
  }

  @Patch('/:id')
  @ApiOperation({ summary: `Update a single non soft deleted user` })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: User })
  async patchUser(
    @Param('id', ParseMongoObjectIdPipe) id: Types.ObjectId,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.getModel().findOneAndUpdate({_id: id, isDeleted: false}, body);
  }

  @Delete('/:id')
  @ApiOperation({ summary: `Soft delete a single user` })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: User })
  async deleteUser(
    @Param('id', ParseMongoObjectIdPipe) id: Types.ObjectId,
  ): Promise<User> {
    return await this.usersService.getModel().findByIdAndUpdate(id, { isDeleted: true });
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      // Allow only CSV mimetypes
      fileFilter: (req, file, callback) => {
        if (!file.mimetype?.match(/text\/csv/i)) {
          return callback(null, false);
        }
        callback(null, true);
      },
      storage: diskStorage({
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadUsers(
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<UploadUsersResponseDto> {
    if (!file) {
      throw new UnprocessableEntityException(
        'Uploaded file is not a CSV file.',
      );
    }

    const users = await CsvParser.parse(file.path);
    const result = await this.usersService.bulk_create(users);
    return new UploadUsersResponseDto({
      failedCount: users.length - result.length,
      successCount: result.length,
    });
  }
}
