import { desc } from 'drizzle-orm'
import * as fs from 'fs'

const dto_obj = {
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



function make_desc_str() {
    let str = ''
    let str_desc = ""
    for (const key in dto_obj) {
        const dto = dto_obj[key]
        const fields = dto.field || []
        const list_api_property = dto.ApiProperty || []
        const isInMap = dto.isIn || {}

        str += `export  interface ${key} {\n`
        str_desc=""


        for (const f of fields) {
            const str_field = f.field
            let str_type = f.type
            // 处理 isIn
            const isInInfo = isInMap[str_field]
            if (isInInfo && Array.isArray(isInInfo.list) && isInInfo.list.length > 0) {
                str_type = isInInfo.list.map((v: any) => JSON.stringify(v)).join(' | ')
            }

            /**
             * @example
             * ```ts
             * let form={
             *  code:"123456",                                                                                       // [验证码]
             *  age:18,                                                                                              // [年龄]
             *  kind:"个人",                                                                                           // [分类]
             *  list_main_img:[{url:"https://www.baidu.com/img/flexible/logo/pc/result.png",file_name:"result.png"}] // [列表-主图]
             * }
             * ```
             */

            // const obj_api_property = list_api_property.find((item: any) => item.field === str_field)
            // const str_description = obj_api_property?.description
            // const str_example = obj_api_property?.example
            // console.log('str_description', str_description)
            // console.log('str_example', str_example)

            // desc_str += `// [${str_description}] 示例: ${str_example}\n`





            str += ` ${str_field}: ${str_type};\n`

        }

        str += `}\n\n`
    }



    console.log(111, str)
}



make_desc_str()






// fs.writeFileSync('D:/BBB/sys_store/back1/src/parse222/dto_interface.ts', str)