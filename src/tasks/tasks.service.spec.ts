import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

// 今回はDBのアクセスはモック
describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository;

  // beforeEachは各テストの前に実行される。
  beforeEach(async () => {
    // テストモジュールを作成
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useFactory: mockRepository }
      ]
    }).compile();

    // テストモジュールからサービスを取得
    tasksService = await module.get<TasksService>(TasksService);
    // テストモジュールからリポジトリーを取得
    taskRepository = await module.get(getRepositoryToken(Task));
  });

  describe('getTasks', () => {
    // 全件取得のテスト
    it('get all tasks', async () => {
      // モックの戻り値を設定
      taskRepository.find.mockResolvedValue('mockTask');
      // メソッドが呼ばれていないことを確認
      expect(taskRepository.find).not.toHaveBeenCalled();

      // メソッドを実行
      const result = await tasksService.getTasks()
      // メソッドが呼ばれたことを確認
      expect(taskRepository.find).toHaveBeenCalled();
      // 戻り値が想定通りであることを確認
      expect(result).toEqual('mockTask');
    });
  });

  describe('getTaskById', () => {
    it('find success', async () => {
      const mockTask = { title: 'mockTitle', description: 'mockDesc' };
      taskRepository.findOne.mockResolvedValue(mockTask);
      expect(taskRepository.findOne).not.toHaveBeenCalled();

      const mockId: number = 1;
      const result = await tasksService.getTaskById(mockId);
      expect(taskRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });

    it('task is not found', async () => {
      const mockId: number = 1;
      taskRepository.findOne.mockResolvedValue(null);
    
      await expect(async () => {
        await tasksService.getTaskById(mockId);
      }).rejects.toThrow(NotFoundException);
    });
    
  });

  describe('createTask', () => {
    it('insert task', async () => {
      const mockTask = { title: 'mockTitle', description: 'mockDesc' };
      taskRepository.save.mockResolvedValue(mockTask);
      expect(taskRepository.save).not.toHaveBeenCalled();
		
      const result = await tasksService.createTask(mockTask);
      expect(taskRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        title: mockTask.title,
        description: mockTask.description,
        status: 'OPEN'
      });
    });
  });

  describe('deleteTask', () => {
    it('delete task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      const mockId: number = 1;
      await tasksService.deleteTask(mockId);
      expect(taskRepository.delete).toHaveBeenCalledWith(mockId);
    });

    it('delete error', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });

      const mockId: number = 1;
      expect(tasksService.deleteTask(mockId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTask', () => {
    it('update status', async () => {
      const mockStatus = 'DONE';
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: 'OPEN'
      });
      expect(tasksService.getTaskById).not.toHaveBeenCalled();

      const mockId: number = 1;
      const result = await tasksService.updateTask(mockId, mockStatus);
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(taskRepository.save).toHaveBeenCalled();
      expect(result.status).toEqual(mockStatus);
    });
  });
});