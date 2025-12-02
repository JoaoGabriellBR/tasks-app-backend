// Módulo NestJS que agrupa todos os componentes relacionados a tarefas.

import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService]
})
export class TasksModule {}
