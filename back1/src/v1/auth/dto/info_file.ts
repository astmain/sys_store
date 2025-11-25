//D:\BBB\sys_store\back1\src\v1\auth\dto\info_file.ts
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber } from 'class-validator'
import { IsString } from 'class-validator'
import { IsIn } from 'class-validator'
import { Matches } from 'class-validator'
import { IsArray } from 'class-validator'




export class info_file {
  @ApiProperty({ description: "url", example: "https://www.baidu.com/img/flexible/logo/pc/result.png" })
  @IsString()
  @Matches(/^https?:\/\//, { message: "url-必须以http或https开头" })
  url: string

  @ApiProperty({ description: "文件名称", example: "result.png" })
  @IsString()
  file_name: string
}


