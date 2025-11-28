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



let my_remark = `
/**
* @example :
* my_replace_tsts
* let my_replace_class_name = {
my_replace_code}
* my_replace_ts
*/
`.replace(/my_replace_ts/g, "```")

const path_file_write = 'D:/BBB/sys_store/back1/src/parse555/dto_interface.ts'
make_dto_interface_1({ dto_obj, path_file_write })

export function make_dto_interface_1({ dto_obj, path_file_write }: { dto_obj: any, path_file_write: string }) {

    let str_all = ''
    for (const key in dto_obj) {
        let str_one = ''
        const dto_one = dto_obj[key]
        console.log('dto_one---', key, dto_one)
        str_one += `export  interface ${key} {\n`
        for (let i = 0; i < dto_one.field.length; i++) {
            const f = dto_one.field[i]
            str_one += ` ${f.field}: ${f.type};\n`
            if (i === dto_one.field.length - 1) {
                str_one += `}\n\n`

                let str_remake = ''
                for (let i = 0; i < dto_one.ApiProperty.length; i++) {
                    const item = dto_one.ApiProperty[i]
                    // console.log('item', item)
                    const field_type = dto_one.field.find(f => f.field === item.field)?.type //获取dto_one.field中对应的类型  ,item.field 是字段名称
                    // console.log('field_type', field_type)

                    let example_value: any


                    if (field_type === "string") {
                        example_value = `"${item.example}"`
                    } else if (field_type === "number") {
                        example_value = item.example
                    } else if (field_type === "boolean") {
                        example_value = item.example
                    } else if (field_type === "array") {
                        example_value = item.example
                    } else if (field_type === "object") {
                        example_value = item.example
                    } else {
                        // console.log('特殊自定义类型---field_type', field_type)
                        example_value = field_type
                    }



                    // 处理装饰器@IsIn
                    if (dto_one.isIn[item.field]) {
                        item.description = item.description + dto_one.isIn[item.field].list.join('|')
                    }
                    str_remake += ` ${item.field}: ${example_value};  //[${item.description}] \n`
                    dto_one.ApiProperty[i].description
                }

                //                                
                str_remake = my_remark.replace(/my_replace_code/g, str_remake)  //替换代码        
                str_remake = my_remark.replace(/my_replace_class_name/g, key)   //替换代码        
                str_remake = str_remake.replace(/^\s*\r?\n/gm, '')      //删除空白行
                str_one = str_one.replace(/^/, str_remake); // /^/ 字第一个位置,增加备注

            }
        }



        str_all += str_one
    }
    fs.writeFileSync(path_file_write, str_all)
    return str_all
}










