//D:\BBB\sys_store\back1\src\v1\auth\dto\login_base.ts
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber } from 'class-validator'
import { IsString } from 'class-validator'
import { IsIn } from 'class-validator'
import { Matches } from 'class-validator'
import { IsArray } from 'class-validator'




import { info_file } from './info_file'




export class login_base {
  @ApiProperty({ description: '验证码', example: '123456' })
  @IsString()
  code: string

  @ApiProperty({ description: '年龄', example: 18 })
  @IsNumber()
  age: number

  @ApiProperty({ description: '分类', example: '个人' })
  @IsIn(['个人', '企业', '国企', '私企'], { message: "分类:必须是-['个人', '企业','国企','私企']" })
  kind: string


  @ApiProperty({ description: "列表-主图", type: [info_file] })
  @Type(() => info_file)
  @IsArray()
  list_main_img: info_file[]
}

export class login_base222 {
  @ApiProperty({ description: '验证码', example: '123456' })
  @IsString()
  code: string

  @ApiProperty({ description: '年龄', example: 18 })
  @IsNumber()
  age: number

  @ApiProperty({ description: '分类', example: '个人' })
  @IsIn(['个人', '企业', '国企', '私企'], { message: "分类:必须是-['个人', '企业','国企','私企']" })
  kind: string


  @ApiProperty({ description: "列表-主图", type: [info_file] })
  @Type(() => info_file)
  @IsArray()
  list_main_img: info_file[]
}




