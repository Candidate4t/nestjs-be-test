import { ApiResponseProperty } from '@nestjs/swagger';
import {
  IPaginatedResponse,
  PaginatedResponseSortEnum,
} from '../interfaces/paginated-response.interface';

export class PaginatedResponseDto<T> implements IPaginatedResponse<T> {
  data: T[];

  @ApiResponseProperty()
  limit: number = 20;

  @ApiResponseProperty()
  page: number = 1;

  @ApiResponseProperty()
  sort: PaginatedResponseSortEnum;

  @ApiResponseProperty()
  sortBy: string = 'createdAt';

  constructor(args?: PaginatedResponseDto<T>) {
    Object.assign(this, args);
  }
}
