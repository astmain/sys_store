import * as fs from 'fs'
// import { login_base } from './dto_interface'
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

// 根据类型给兜底 example
function fallbackExampleByType(type: string): string {
  if (type.endsWith('[]')) return '[]'
  if (type === 'string') return '""'
  if (type === 'number') return '0'
  if (type === 'boolean') return 'false'
  return 'undefined'
}

// 构造某个 dto 的示例对象：{url:"...",file_name:"..."}
function buildNestedExample(dtoKey: string): string {
  const dto: any = (dto_obj as any)[dtoKey]
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
  const dto: any = (dto_obj as any)[key]
  const fields = dto.field || []
  const apiList = dto.ApiProperty || []
  const isInMap = dto.isIn || {}
  const apiMap: Record<string, any> = {}
  for (const a of apiList) apiMap[a.field] = a

  // ===== 先准备每一行的示例数据 =====
  type ExampleLine = {
    fieldName: string
    valueStr: string
    desc: string
    trailingComma: string
  }
  const exampleLines: ExampleLine[] = fields.map((f: any, index: number) => {
    const fieldName = f.field
    const api = apiMap[fieldName]
    const desc = api?.description ?? ''
    const isInInfo = isInMap[fieldName]

    // example 值
    let valueStr: string
    const hasExample =
      api && Object.prototype.hasOwnProperty.call(api, 'example')

    if (hasExample) {
      valueStr = JSON.stringify(api.example)
    } else {
      const arrayMatch = f.type.match(/^(.+)\[\]$/)
      if (arrayMatch) {
        const baseType = arrayMatch[1]
        if ((dto_obj as any)[baseType]) {
          // info_file[] 这种：用嵌套 dto 的 example
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

    return { fieldName, valueStr, desc, trailingComma }
  })

  // 为了对齐注释里的 `//`，算一下最长的 "  字段:值," 长度
  const maxCodeLength = exampleLines.reduce((max, line) => {
    const codeText = `${line.fieldName}:${line.valueStr}${line.trailingComma}`
    const len = `  ${codeText}`.length
    return Math.max(max, len)
  }, 0)

  // ============ 生成 @example 注释块 ============
  str += `/**\n`
  str += ` * @example\n`
  str += ` * \`\`\`ts\n`
  str += ` * let form={\n`

  exampleLines.forEach(line => {
    const codeText = `${line.fieldName}:${line.valueStr}${line.trailingComma}`
    const descText = line.desc ? `// [${line.desc}]` : ''
    const currentLen = `  ${codeText}`.length
    const padLen = Math.max(1, maxCodeLength - currentLen + 1) // 至少 1 个空格
    const padding = ' '.repeat(padLen)
    str += ` *  ${codeText}${padding}${descText}\n`
  })

  str += ` * }\n`
  str += ` * \`\`\`\n`
  str += ` */\n`

  // ============ 生成 interface ============
  str += `export interface ${key} {\n`

  for (const f of fields) {
    const fieldName = f.field
    const isInInfo = isInMap[fieldName]

    // 实际 interface 类型：kind 用联合类型
    let typeStr = f.type
    if (isInInfo && Array.isArray(isInInfo.list) && isInInfo.list.length > 0) {
      typeStr = isInInfo.list.map((v: any) => JSON.stringify(v)).join(' | ')
    }

    str += `  ${fieldName}: ${typeStr};\n`
  }

  str += `}\n\n`
}

console.log(str)


console.log(str)

fs.writeFileSync('D:/BBB/sys_store/back1/src/parse222/dto_interface.ts', str ,{ encoding: 'utf8' });
