import {
  Controller,
  Post,
  Body,
  Get,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.tasksService.findAll();
  }
}
