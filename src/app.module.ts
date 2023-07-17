import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TasksModule,
    // importsに追加
    TypeOrmModule.forRoot({
      type: 'postgres',       // DBの種類
      port: 5432,             // 使用ポート
      database: 'postgres',    // データベース名
      host: 'localhost',      // DBホスト名
      username: 'postgres',       // DBユーザ名
      password: 'passw0rd',       // DBパスワード
      synchronize: true,      // モデル同期(trueで同期)
      entities: [__dirname + '/**/*.entity.{js,ts}'],  // ロードするエンティティ
    })
  ],
})
export class AppModule {}