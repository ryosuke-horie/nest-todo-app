import { IsNotEmpty } from "class-validator";

export class TaskPropertyDto {
    // デコレータの@IsNotEmptyは値に"",null,undefinedを受け入れません。

    // titleの値が空の場合はエラーを返す
    @IsNotEmpty()
    title: string;

    // descriptionの値が空の場合はエラーを返す
    @IsNotEmpty()
    description: string;
}