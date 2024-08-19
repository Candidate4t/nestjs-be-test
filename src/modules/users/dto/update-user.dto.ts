import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @ApiProperty({
    required: false,
  })
  @IsDateString()
  birthDate: Date;

  constructor(args?: Partial<UpdateUserDto>) {
    super();
    Object.assign(this, args);
  }

}
