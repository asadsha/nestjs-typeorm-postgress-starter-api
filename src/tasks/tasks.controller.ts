import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './enum/task-status.enum';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private tasksService: TasksService) { }

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @Req() req
  ): Promise<Task[]> {
    this.logger.verbose(`user ${req.user.name} retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`); // logging info
    return this.tasksService.getTasks(filterDto, req.user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req
  ): Promise<Task> {
    this.logger.verbose(`user ${req.user.name} retrieving single task by id.`);
    return this.tasksService.getTaskById(id, req.user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req,
  ): Promise<Task> {
    this.logger.verbose(`user ${req.user.name} creating a new task. Data: ${JSON.stringify(createTaskDto)}`);
    return this.tasksService.createTask(createTaskDto, req.user);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() req
  ): Promise<void> {
    this.logger.verbose(`user ${req.user.name} deleting task`); // logging info
    return this.tasksService.deleteTask(id, req.user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @Req() req
  ): Promise<Task> {
    this.logger.verbose(`user ${req.user.name} updating task. Status: ${status}`); // logging info
    return this.tasksService.updateTaskStatus(id, status, req.user);
  }
}
