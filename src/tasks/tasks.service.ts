import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskPropertyDto } from './dto/task-property.dto';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
    // タスクリポジトリーをインジェクション
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ) { }

    // タスク取得
    async getTasks(): Promise<Task[]> {
        return this.taskRepository.find();
    }

    // [id]のタスク取得
    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne({
            where: {
              id: id,
            },
          });

        if (!found) {
            throw new NotFoundException();
        }

        return found;
    }

    // 新規タスク登録
    async createTask(
        // バリデーションパイプを使用するため、@Body()を付与
        taskPropertyDto: TaskPropertyDto
        ): Promise<Task> {
        const { title, description } = taskPropertyDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = 'OPEN'; // 初期値

        try {
            await this.taskRepository.save(task);
        } catch (error) {
            throw new InternalServerErrorException();
        }

        return task;
    }

    // 登録されている[id]のタスク削除
    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException();
        }
    }

    // 登録されている[id]のタスク更新
    async updateTask(
        id: number,
        status: string): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await this.taskRepository.save(task);
        return task;
    }
}