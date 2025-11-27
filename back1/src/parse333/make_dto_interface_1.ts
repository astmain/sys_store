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
* @example: my_replace_tsts
my_replace_code
* my_replace_ts
*/
`.replace(/my_replace_ts/g, "```")



make_dto_interface_1(dto_obj)
export function make_dto_interface_1(dto_obj: any = {}) {
    let str_all = ''

    for (const key in dto_obj) {
         
        const dto = dto_obj[key]
        const fields = dto.field || []
        const list_api_property = dto.ApiProperty || []
        const isInMap = dto.isIn || {}

        str_all += `export  interface ${key} {\n`
     

        for (let i = 0; i < fields.length; i++) {
            const f = fields[i]
            const str_field = f.field
            let str_type = f.type
            // 处理 isIn
            const isInInfo = isInMap[str_field]
            if (isInInfo && Array.isArray(isInInfo.list) && isInInfo.list.length > 0) {
                str_type = isInInfo.list.map((v: any) => JSON.stringify(v)).join(' | ')
            }


            str_all += ` ${str_field}: ${str_type};\n`
            console.log('111---str_all---', str_all)
            // 最后一个字段拼接备注
            if (i === fields.length - 1) {
                str_all += `}\n\n`//字符串拼接,最后一个字符加上符号}换行
                console.log('list_api_property', list_api_property)
                let form111 = ""
                for (let i = 0; i < list_api_property.length; i++) {
                    const item = list_api_property[i]
                    const field = item.field
                    const description = item.description
                    const example = item.example
                    form111 += `\n*  ${field}:${example},  //[${description}]  \n`
                    console.log('222222222222form111', form111)


                }

                let form1222 = `* let ${key}={${form111}*}
                    
                `

                //                            //替换代码                     删除空白行
                my_remark = my_remark.replace(/my_replace_code/g, form1222).replace(/^\s*\r?\n/gm, '')


                const interface_str_end = str_all.replace(/^/, my_remark); // /^/ 字第一个位置,增加备注
                str_all = interface_str_end
            }




        }

    }



    console.log("999---str_all---", str_all)
    fs.writeFileSync('D:/BBB/sys_store/back1/src/parse333/dto_interface.ts', str_all)
}










