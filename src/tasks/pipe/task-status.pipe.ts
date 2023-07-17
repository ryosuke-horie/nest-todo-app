import { BadRequestException, PipeTransform } from "@nestjs/common";

// PipeTransformを継承して、Pipeを作成
// 検証機能を持つ
export class TaskStatusPipe implements PipeTransform {
    // statusが'OPEN','PROGRESS','DONE'のいづれかでないとエラーを返す
    readonly allowStatus = [
        'OPEN',
        'PROGRESS',
        'DONE'
    ];

    // valueには、@Body('status') status: stringのstatusの値が入る
    transform(value: any) {
        value = value.toUpperCase();

        // statusが'OPEN','PROGRESS','DONE'のいづれかでない場合はエラーを返す
        if(!this.isStatusValid(value)) {
            throw new BadRequestException();
        }

        return value;
    }

    // statusが'OPEN','PROGRESS','DONE'のいづれかであるかを判定
    private isStatusValid(status: any) {
        const result = this.allowStatus.indexOf(status);
        return result !== -1;
    }
}