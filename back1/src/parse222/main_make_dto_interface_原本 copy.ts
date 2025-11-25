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


let str = ''

for (const key in dto_obj) {
  const dto = dto_obj[key]
  const fields = dto.field || []
  const apiList = dto.ApiProperty || []
  const isInMap = dto.isIn || {}

  str += `export  interface ${key} {\n`

  for (const f of fields) {
    const fieldName = f.field

    // 找到对应 ApiProperty
    const api = apiList.find((item: any) => item.field === fieldName)
    const isInInfo = isInMap[fieldName]

    // ===== 生成你想要的注释格式 =====
    // /**
    //  * [分类] 示例: "个人"
    //  */
    if (api && (api.description || 'example' in api)) {
      const desc = api.description ?? ''
      // 是否有 example 字段（可能为 0 / 空串，所以用 in 判断）
      const hasExample = Object.prototype.hasOwnProperty.call(
        api,
        'example'
      )

      let line = ''
      if (desc) line += ` [${desc}]`
      if (hasExample) line += ` 示例: ${JSON.stringify(api.example)}`

      str += `  /**`
      str += line 
      str += `   */\n`
    }

    // ===== 类型：保留 isIn 的联合类型逻辑 =====
    let typeStr = f.type
    if (isInInfo && Array.isArray(isInInfo.list) && isInInfo.list.length > 0) {
      typeStr = isInInfo.list.map((v: any) => JSON.stringify(v)).join(' | ')
    }

    str += `  ${fieldName}: ${typeStr};\n`
  }

  str += `}\n\n`
}

console.log(str)


fs.writeFileSync('D:/BBB/sys_store/back1/src/parse222/dto_interface.ts', str)