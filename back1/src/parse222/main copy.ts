// main copy 3.ts
import * as ts from 'typescript'
import * as path from 'path'
import * as fs from 'fs'

// ==================== 入口文件列表 ====================
const entryFiles = [
    'D:/BBB/sys_store/back1/src/v1/auth/dto/login_base.ts',
]

/**
 * 尝试根据 import 路径解析出实际文件路径
 * 例如:
 *  - './info_file'       -> info_file.ts / info_file.js / info_file/index.ts ...
 */
function resolveImportPath(baseFile: string, modulePath: string): string | undefined {
    // 非相对路径（如 'class-validator'），这里直接忽略
    if (!modulePath.startsWith('.')) return undefined

    const baseDir = path.dirname(baseFile)
    const fullBase = path.resolve(baseDir, modulePath)

    const exts = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']

    // 1) 先尝试 fullBase + 各种扩展名
    for (const ext of exts) {
        const candidate = fullBase + ext
        if (fs.existsSync(candidate)) {
            return candidate
        }
    }

    // 2) 再尝试 fullBase 作为文件夹，寻找 index.*
    for (const ext of exts) {
        const candidate = path.join(fullBase, 'index' + ext)
        if (fs.existsSync(candidate)) {
            return candidate
        }
    }

    // 找不到就返回 undefined
    return undefined
}

/**
 * 从入口文件集合出发，递归解析所有相对 import，得到所有相关文件
 */
function collectAllFiles(entryFiles: string[]): string[] {
    const visited = new Set<string>()

    function visit(filePath: string) {
        const path_abs = path.resolve(filePath)
        // console.log('path_abs', path_abs)
        if (visited.has(path_abs)) return
        visited.add(path_abs)

        // if (!fs.existsSync(path_abs)) {
        //     console.warn('文件不存在:', path_abs)
        //     return
        // }

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
                        const path_import = path.resolve(path_base, modulePath + '.ts')
                        console.log('path_import', path_import)
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
const allFiles = collectAllFiles(entryFiles)
console.log('收集到的所有文件:')
for (const f of allFiles) {
    console.log(' -', f)
}
