import { IsString, IsOptional, IsEnum, Length } from 'class-validator';

export enum Status {
  TO_DO = 'to-do',
  DOING = 'doing',
  DONE = 'done'
}

export class CreateTaskDto {
  @IsString({ message: 'Title must be a string' })
  @Length(1, 255, { message: 'Title must be between 1 and 255 characters' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsEnum(Status, { message: 'Status must be one of: to-do, doing, done' })
  status: Status;
}
