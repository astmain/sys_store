
import * as ts from 'typescript'
import * as path from 'path'
import * as fs from 'fs'
import { tool_list_import_file } from './tool_list_import_file'



// ==================== 定义类型 ====================
type infer_field_type = { field: string; type: string }
type infer_IsIn = { field: string; values: unknown[]; message?: string; }
type infer_ApiProperty = { field: string; description?: string; example?: unknown }



// ==================== 入口函数 ====================
export function make_dto_list_flat({ list_path_file }: { list_path_file: string[] }) {
    // ==================== 全局参数 ====================
    let dto_obj: any = {}
    const list_source_file: ts.SourceFile[] = []

    const program = ts.createProgram(list_path_file, {
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.CommonJS,
    })

    for (const path_file of list_path_file) {
        const sf = program.getSourceFile(path_file)
        if (sf) {
            list_source_file.push(sf)
        } else {
            console.warn('资源文件不存在:', path_file)
        }
    }

    if (list_source_file.length === 0) {
        throw new Error('资源文件0个')
    }

    // 遍历所有资源文件,获取所有类名、字段类型以及 ApiProperty 信息
    for (const source_file of list_source_file) {
        const list_class = tool_list_class(source_file)
        // console.log('所有类名:', list_class)
        for (const class_name of list_class) {
            if (!dto_obj[class_name]) { dto_obj[class_name] = {} }
            const list_api = tool_parse_ApiProperty(source_file, class_name)
            dto_obj[class_name]['list_api'] = list_api
            // console.log(`类 ${class_name} 的 ApiProperty 信息:`, list_api)
            const list_field = tool_key_type(source_file, class_name)
            dto_obj[class_name]['list_field'] = list_field
            // console.log(`类 ${class_name} 的字段:`, list_field)
            const list_isIn = tool_parse_IsIn(source_file, class_name)
            dto_obj[class_name]['list_isIn'] = list_isIn
            // console.log(`类 ${class_name} 的 IsIn 信息:`, list_isIn)
        }
    }
    console.log('==============================')
    let dto_list_flat: any[] = []
    for (const class_name in dto_obj) {
        const list_api = dto_obj[class_name]['list_api']
        const field_list = dto_obj[class_name]['list_field']
        const list_isIn = dto_obj[class_name]['list_isIn']
        console.log(class_name, 'list_api', list_api)
        console.log(class_name, 'field_list', field_list)
        console.log(class_name, 'list_isIn', list_isIn)
        for (const index in list_api) {
            const item = list_api[index]
            // const  class_name
            console.log('item', item)
            const field = item['field']
            const description = item['description']
            const example = item['example']
            const isIn = list_isIn ? list_isIn[field] : undefined
            const type = field_list.find(item => item['field'] === field)?.type
            dto_list_flat.push({ class_name, field, description, example, isIn, type })
        }


    }
    // console.log('dto_list_flat', dto_list_flat)
    return dto_list_flat
    // ==================== 工具函数:获取类名-开始 ====================
    /**
     * 获取类名
     */
    function tool_list_class(sourceFile: ts.SourceFile): string[] {
        const list_class_name: string[] = []
        function visit(node: ts.Node) {
            if (ts.isClassDeclaration(node) && node.name) {
                list_class_name.push(node.name.text)
            }
            ts.forEachChild(node, visit)
        }
        visit(sourceFile)
        return list_class_name
    }


    /**
     * 获取字段类型
     */
    function tool_key_type(sourceFile: ts.SourceFile, className: string): infer_field_type[] {
        const result: infer_field_type[] = []
        function visit(node: ts.Node) {
            if (ts.isClassDeclaration(node) && node.name?.text === className) {
                node.members.forEach(member => {
                    if (ts.isPropertyDeclaration(member)) {
                        if (!member.name || !ts.isIdentifier(member.name)) return
                        const field = member.name.text
                        let typeStr = 'any'
                        if (member.type) {
                            typeStr = member.type.getText(sourceFile)
                        }
                        result.push({ field, type: typeStr })
                    }
                })
            }
            ts.forEachChild(node, visit)
        }

        visit(sourceFile)
        return result
    }


    /**
     * 解析ApiProperty得到描述和示例
     */
    function tool_parse_ApiProperty(sourceFile: ts.SourceFile, className: string): infer_ApiProperty[] {
        const result: infer_ApiProperty[] = []
        function visit(node: ts.Node) {
            if (ts.isClassDeclaration(node) && node.name?.text === className) {
                node.members.forEach(member => {
                    if (!ts.isPropertyDeclaration(member)) return
                    if (!member.name || !ts.isIdentifier(member.name)) return
                    const field = member.name.text
                    let description: string | undefined
                    let example: unknown
                    let hasApiProperty = false
                    // TS 5+ 中使用 getDecorators，而不是 member.decorators
                    const decorators = ts.getDecorators(member) ?? []
                    for (const deco of decorators) {
                        const expr = deco.expression
                        if (!ts.isCallExpression(expr)) continue
                        const decoName = expr.expression.getText(sourceFile)
                        if (decoName !== 'ApiProperty') continue
                        hasApiProperty = true
                        const arg = expr.arguments[0]
                        if (!arg || !ts.isObjectLiteralExpression(arg)) continue
                        // 解析 { description: 'xxx', example: 'yyy' }
                        for (const prop of arg.properties) {
                            if (!ts.isPropertyAssignment(prop)) continue
                            const nameNode = prop.name
                            let propName: string | undefined
                            if (ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode)) {
                                propName = nameNode.text
                            }
                            if (!propName) continue
                            const init = prop.initializer
                            if (propName === 'description') {
                                if (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) {
                                    description = init.text
                                } else {
                                    // 非常规写法兜底：直接用源码字符串
                                    description = init.getText(sourceFile)
                                }
                            }

                            if (propName === 'example') {
                                if (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) {
                                    example = init.text
                                } else if (ts.isNumericLiteral(init)) {
                                    example = Number(init.text)
                                } else if (init.kind === ts.SyntaxKind.TrueKeyword) {
                                    example = true
                                } else if (init.kind === ts.SyntaxKind.FalseKeyword) {
                                    example = false
                                } else if (init.kind === ts.SyntaxKind.NullKeyword) {
                                    example = null
                                } else {
                                    // 复杂表达式：返回表达式源码
                                    example = init.getText(sourceFile)
                                }
                            }
                        }
                    }

                    if (hasApiProperty) {
                        result.push({ field, description, example })
                    }
                })
            }

            ts.forEachChild(node, visit)
        }
        visit(sourceFile)
        return result
    }



    /**
     * 解析IsIn得到 @IsIn([...], { message: "..." })
     */
    function tool_parse_IsIn(sourceFile: ts.SourceFile, className: string) {
        const result = {} as infer_IsIn
        function visit(node: ts.Node) {
            if (ts.isClassDeclaration(node) && node.name?.text === className) {
                node.members.forEach(member => {
                    if (!ts.isPropertyDeclaration(member)) return
                    if (!member.name || !ts.isIdentifier(member.name)) return
                    const field = member.name.text
                    let values: unknown[] = []
                    let message: string | undefined
                    let hasIsIn = false
                    // TS 5+ 使用 getDecorators，而不是 member.decorators
                    const decorators = ts.getDecorators(member) ?? []
                    for (const deco of decorators) {
                        const expr = deco.expression
                        if (!ts.isCallExpression(expr)) continue
                        const decoName = expr.expression.getText(sourceFile)
                        if (decoName !== 'IsIn') continue
                        hasIsIn = true
                        const [arg0, arg1] = expr.arguments
                        // 第一个参数：数组字面量，例如 ['个人', '企业', ...]
                        if (arg0 && ts.isArrayLiteralExpression(arg0)) {
                            values = arg0.elements.map(el => {
                                if (
                                    ts.isStringLiteral(el) ||
                                    ts.isNoSubstitutionTemplateLiteral(el)
                                ) {
                                    return el.text
                                } else if (ts.isNumericLiteral(el)) {
                                    return Number(el.text)
                                } else if (el.kind === ts.SyntaxKind.TrueKeyword) {
                                    return true
                                } else if (el.kind === ts.SyntaxKind.FalseKeyword) {
                                    return false
                                } else if (el.kind === ts.SyntaxKind.NullKeyword) {
                                    return null
                                } else {
                                    // 复杂表达式：直接返回源码字符串
                                    return el.getText(sourceFile)
                                }
                            })
                        }

                        // 第二个参数：配置对象 { message: "xxx" }
                        if (arg1 && ts.isObjectLiteralExpression(arg1)) {
                            for (const prop of arg1.properties) {
                                if (!ts.isPropertyAssignment(prop)) continue
                                const nameNode = prop.name
                                let propName: string | undefined
                                if (ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode)) {
                                    propName = nameNode.text
                                }
                                if (propName !== 'message') continue

                                const init = prop.initializer
                                if (
                                    ts.isStringLiteral(init) ||
                                    ts.isNoSubstitutionTemplateLiteral(init)
                                ) {
                                    message = init.text
                                } else {
                                    message = init.getText(sourceFile)
                                }
                            }
                        }
                    }
                    if (hasIsIn) {
                        result[field] = { list: values, message }
                    }
                })
            }

            ts.forEachChild(node, visit)
        }
        visit(sourceFile)
        return result
    }
    // ==================== 工具函数:获取类名-结束 ====================
}


