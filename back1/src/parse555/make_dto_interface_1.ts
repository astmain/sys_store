import { ApiIAmATeapotResponse } from '@nestjs/swagger'
import { desc } from 'drizzle-orm'
import * as fs from 'fs'


let dto_obj = {
    "login_base": {
        "field": [
            {
                "field": "code",
                "type": "string"
            },
            {
                "field": "age",
                "type": "number"
            },
            {
                "field": "kind",
                "type": "string"
            },
            {
                "field": "list_main_img",
                "type": "info_file[]"
            }
        ],
        "ApiProperty": [
            {
                "field": "code",
                "description": "验证码",
                "example": "123456"
            },
            {
                "field": "age",
                "description": "年龄",
                "example": 18
            },
            {
                "field": "kind",
                "description": "分类",
                "example": "个人"
            },
            {
                "field": "list_main_img",
                "description": "列表-主图"
            }
        ],
        "isIn": {
            "kind": {
                "list": [
                    "个人",
                    "企业",
                    "国企",
                    "私企"
                ],
                "message": "分类:必须是-['个人', '企业','国企','私企']"
            }
        }
    },
    "info_file": {
        "field": [
            {
                "field": "url",
                "type": "string"
            },
            {
                "field": "file_name",
                "type": "string"
            }
        ],
        "ApiProperty": [
            {
                "field": "url",
                "description": "url",
                "example": "https://www.baidu.com/img/flexible/logo/pc/result.png"
            },
            {
                "field": "file_name",
                "description": "文件名称",
                "example": "result.png"
            }
        ],
        "isIn": {}
    }
}
const path_file_write = 'D:/BBB/sys_store/back1/src/parse555/dto_interface.ts'


let my_remark = `
/**
* @example :
* my_replace_tsts
my_replace_code
* my_replace_ts
*/
`.replace(/my_replace_ts/g, "```")
make_dto_interface_1({ dto_obj, path_file_write })
export function make_dto_interface_1({ dto_obj, path_file_write }: { dto_obj: any, path_file_write: string }) {

    let str_all = ''
    for (const key in dto_obj) {
        let str_one = ''
        const dto_one = dto_obj[key]
        console.log('dto_one', dto_one)
        str_one += `export  interface ${key} {\n`
        for (let i = 0; i < dto_one.field.length; i++) {
            const f = dto_one.field[i]
            str_one += ` ${f.field}: ${f.type};\n`
            if (i === dto_one.field.length - 1) {
                str_one += `}\n\n`

                let str_remake = ''
                for (let i = 0; i < dto_one.ApiProperty.length; i++) {
                    // const item = dto_one.ApiProperty[i]
                    // str_remake += ` ${item.field}: ${item.type};\n`
                    console.log('dto_one.ApiProperty[i]', dto_one.ApiProperty[i])

                    // {
                    //     "field": "code",
                    //     "description": "验证码",
                    //     "example": "123456"
                    //   },
                }
                // console.log('str_remake', str_remake)

                //                            //替换代码                     删除空白行
                my_remark = my_remark.replace(/my_replace_code/g, str_one).replace(/^\s*\r?\n/gm, '')

            }
        }



        str_all += str_one
    }
    fs.writeFileSync(path_file_write, str_all)
    return str_all
}










