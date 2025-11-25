// main copy 3.ts
import * as ts from 'typescript'
import * as path from 'path'
import * as fs from 'fs'

// ==================== 入口文件列表 ====================
const entryFiles = [
    'D:/BBB/sys_store/back1/src/v1/auth/dto/login_base.ts',
]

/**
 * 从入口文件集合出发，递归解析所有相对 import，得到所有相关文件
 */
function tool_list_import_file(entryFiles: string[]): string[] {
    const visited = new Set<string>()

    function visit(filePath: string) {
        const path_abs = path.resolve(filePath)// 绝对路径
        if (visited.has(path_abs)) return
        visited.add(path_abs)

        if (!fs.existsSync(path_abs)) {
            console.warn('文件不存在:', path_abs)
            return
        }

        const code = fs.readFileSync(path_abs, 'utf8')
        const sourceFile = ts.createSourceFile(path_abs, code, ts.ScriptTarget.ESNext, true)

        // 遍历 AST，找 import 语句
        sourceFile.forEachChild(node => {
            if (ts.isImportDeclaration(node)) {
                const moduleSpecifier = node.moduleSpecifier
                if (ts.isStringLiteral(moduleSpecifier)) {
                    const modulePath = moduleSpecifier.text // 比如 './info_file'   '@nestjs/swagger'   'class-validator'
                    if (modulePath.startsWith('.')) {
                        const path_base = path.dirname(path_abs)
                        const path_import = path.resolve(path_base, modulePath + '.ts')//拼接文件路径
                        // console.log('path_import', path_import)
                        visit(path_import)
                    }
                }
            }
        })
    }

    entryFiles.forEach(visit)
    return Array.from(visited)
}

// ==================== 示例调用 ====================
const list_import_file = tool_list_import_file(entryFiles)
console.log('收集到的所有文件---list_import_file', list_import_file)

