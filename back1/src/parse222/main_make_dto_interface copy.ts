import * as fs from 'fs'
import { login_base } from './dto_interface'

const dto_obj = {
    login_base: {
      field: [
        { field: 'code', type: 'string' },
        { field: 'age', type: 'number' },
        { field: 'kind', type: 'string' },
        { field: 'list_main_img', type: 'info_file[]' },
      ],
      ApiProperty: [
        { field: 'code', description: '验证码', example: '123456' },
        { field: 'age', description: '年龄', example: 18 },
        { field: 'kind', description: '分类', example: '个人' },
        { field: 'list_main_img', description: '列表-主图' },
      ],
      isIn: {
        kind: {
          list: ['个人', '企业', '国企', '私企'],
          message: "分类:必须是-['个人', '企业','国企','私企']",
        },
      },
    },
    info_file: {
      field: [
        { field: 'url', type: 'string' },
        { field: 'file_name', type: 'string' },
      ],
      ApiProperty: [
        {
          field: 'url',
          description: 'url',
          example:
            'https://www.baidu.com/img/flexible/logo/pc/result.png',
        },
        {
          field: 'file_name',
          description: '文件名称',
          example: 'result.png',
        },
      ],
      isIn: {},
    },
  }
  
  let str = ''
  
  // 小工具：根据类型简单推一个占位 example
  function fallbackExampleByType(type: string): string {
    if (type.endsWith('[]')) return '[]'
    if (type === 'string') return '""'
    if (type === 'number') return '0'
    if (type === 'boolean') return 'false'
    return 'undefined'
  }
  
  // 小工具：生成某个 dto（如 info_file）的示例对象字符串：{url:"...",file_name:"..."}
  function buildNestedExample(dtoKey: string): string {
    const dto = (dto_obj as any)[dtoKey]
    if (!dto) return '{}'
    const fields = dto.field || []
    const apiList = dto.ApiProperty || []
    const apiMap: Record<string, any> = {}
    for (const a of apiList) apiMap[a.field] = a
  
    const parts: string[] = []
    for (const f of fields) {
      const api = apiMap[f.field]
      let valStr: string
      if (api && Object.prototype.hasOwnProperty.call(api, 'example')) {
        valStr = JSON.stringify(api.example)
      } else {
        valStr = fallbackExampleByType(f.type)
      }
      parts.push(`${f.field}:${valStr}`)
    }
    return `{${parts.join(',')}}`
  }
  
  for (const key in dto_obj) {
    const dto = (dto_obj as any)[key]
    const fields = dto.field || []
    const apiList = dto.ApiProperty || []
    const isInMap = dto.isIn || {}
    const apiMap: Record<string, any> = {}
    for (const a of apiList) apiMap[a.field] = a
  
    // ============ 生成 @example 注释块 ============
    str += `/**\n`
    str += ` * @example\n`
    str += ` * \`\`\`ts\n`
    str += ` * let form={\n`
  
    fields.forEach((f: any, index: number) => {
      const fieldName = f.field
      const api = apiMap[fieldName]
      const desc = api?.description ? `[${api.description}]` : ''
      const isInInfo = isInMap[fieldName]
  
      // 生成 example 值
      let valueStr: string
  
      const hasExample =
        api && Object.prototype.hasOwnProperty.call(api, 'example')
  
      if (hasExample) {
        valueStr = JSON.stringify(api.example)
      } else {
        // 没有 example 的情况，尝试根据类型推一个
        const arrayMatch = f.type.match(/^(.+)\[\]$/)
        if (arrayMatch) {
          const baseType = arrayMatch[1]
          if ((dto_obj as any)[baseType]) {
            // 数组 + 另一个 dto：用嵌套 dto 的 example
            const nested = buildNestedExample(baseType)
            valueStr = `[${nested}]`
          } else {
            valueStr = fallbackExampleByType(f.type)
          }
        } else {
          valueStr = fallbackExampleByType(f.type)
        }
      }
  
      const trailingComma = index === fields.length - 1 ? '' : ','
      const commentPart = desc ? ` // ${desc}` : ''
      str += ` *  ${fieldName}:${valueStr}${trailingComma}${commentPart}\n`
    })
  
    str += ` * }\n`
    str += ` * \`\`\`\n`
    str += ` */\n`
  
    // ============ 生成 interface ============
    str += `export interface ${key} {\n`
  
    for (const f of fields) {
      const fieldName = f.field
      const isInInfo = isInMap[fieldName]
  
      // 类型：有 isIn 列表时用字面量联合类型
      let typeStr = f.type
      if (isInInfo && Array.isArray(isInInfo.list) && isInInfo.list.length > 0) {
        typeStr = isInInfo.list.map((v: any) => JSON.stringify(v)).join(' | ')
      }
  
      str += `  ${fieldName}: ${typeStr};\n`
    }
  
    str += `}\n\n`
  }
  
  console.log(str)
  


fs.writeFileSync('D:/BBB/sys_store/back1/src/parse222/dto_interface.ts', str ,{ encoding: 'utf8' });