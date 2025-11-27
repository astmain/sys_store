import { ApiIAmATeapotResponse } from '@nestjs/swagger'
import { desc } from 'drizzle-orm'
import * as fs from 'fs'

let my_remark = `
/**
* @example :
* my_replace_tsts
my_replace_code
* my_replace_ts
*/
`.replace(/my_replace_ts/g, "```")


export function make_dto_interface_1({ dto_obj, path_file_write }: { dto_obj: any, path_file_write: string }) {
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
            // console.log('111---str_all---', str_all)
            // 最后一个字段拼接备注
            if (i === fields.length - 1) {
                str_all += `}\n\n`//字符串拼接,最后一个字符加上符号}换行
                // console.log('list_api_property', list_api_property)
                let form111 = ""
                for (let i = 0; i < list_api_property.length; i++) {
                    const item = list_api_property[i]
                    const field = item.field
                    const description = item.description
                    const example = item.example
                    form111 += `\n*  ${field}:${example},  //[${description}]  \n`
                    // console.log('222222222222form111', form111)
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



    // console.log("999---str_all---", str_all)
    fs.writeFileSync(path_file_write, str_all)
    return str_all
}










