// デコレーターを使用するためのインポート
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';

// taskコントローラー（ルーティング）
@Controller('tasks')
export class TasksController {
    // 登録されているタスク取得
    @Get()
    getTasks() {
        return "getTasks Success!"
    }

    // [id]のタスク取得
    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number) {
        return `getTaskById Success! Parameter [id:${id}]`
    }

    // 新規タスク登録
    @Post()
    createTask(
        @Body('title') title: string,
        @Body('description') description: string) {
        return `createTask Success! Prameter [title:${title}, descritpion:${description}]`
    }

    // 登録されている[id]のタスク削除
    @Delete('/:id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number) {
        return `deleteTask Success! Prameter [id:${id}]`
    }

    // 登録されている[id]のタスク更新
    @Patch('/:id')
    updateTask(
        // パイプを使用して、idを数値型に変換
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: string ) {
        return `updateTask Success! Prameter [id:${id}, status:${status}]`
    }
}