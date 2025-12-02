import { Injectable } from "@nestjs/common";
import { PrismaClient, Task } from "@prisma/client";
import { CreateTaskDto, Status } from "./dto/create-task.dto";

@Injectable()
export class TasksService {
  private prisma = new PrismaClient();

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const mappedStatus = this.mapDtoStatusToDbFormat(createTaskDto.status);

    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: mappedStatus,
      },
    });

    return task;
  }

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  private mapDtoStatusToDbFormat(status: Status): string {
    switch (status) {
      case Status.TO_DO:
        return "TO_DO";
      case Status.DOING:
        return "DOING";
      case Status.DONE:
        return "DONE";
      default:
        return "TO_DO";
    }
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
