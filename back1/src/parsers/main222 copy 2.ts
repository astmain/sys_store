import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'
main()
function main() {
  const path_file = 'D:/BBB/sys_store/back1/src/v1/auth/dto/login_phone.ts'

  const configPath = ts.findConfigFile(path.dirname(path_file), ts.sys.fileExists, 'tsconfig.json')
  // console.log('configPath', configPath)

  // 设置默认的编译器选项
  let compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.Latest, // 使用最新的 JavaScript 目标版本
    module: ts.ModuleKind.ESNext, // 使用 ESNext 模块系统
    jsx: ts.JsxEmit.None, // 不处理 JSX
    moduleResolution: ts.ModuleResolutionKind.NodeJs, // 使用 Node.js 模块解析策略
    experimentalDecorators: true, // 启用实验性装饰器支持
    emitDecoratorMetadata: true, // 启用装饰器元数据（用于反射）
  }

  if (!configPath) return
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
  // console.log('configFile', configFile)

  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath))
  // console.log('parsed', parsed)

  // 创建编译器主机（提供文件系统访问接口）
  const host = ts.createCompilerHost(compilerOptions)
  // console.log('host', host)

  const allFiles = [path_file]

  const program = ts.createProgram(allFiles, compilerOptions, host)

  // 获取目标源文件的 AST（抽象语法树）
  const sourceFile = program.getSourceFile(path_file)
  if (!sourceFile) return
  // console.log('sourceFile', sourceFile)

  // 创建类型检查器（用于获取类型信息）
  const checker = program.getTypeChecker()
  // console.log('checker', checker)

  sourceFile.forEachChild((node: ts.ClassDeclaration) => {
    if (ts.isClassDeclaration(node)) {
      const class_name = node.name?.text
      // console.log('class_name', class_name)
    }




    node.members?.forEach((member) => {
      if (ts.isPropertyDeclaration(member) && member.name && ts.isIdentifier(member.name)) {
        const name_property = member.name.text
        const name_class = node.name?.text
        // console.log('111name_class', name_class, '--', 'name_property', name_property)

        const decorators = ts.getDecorators ? ts.getDecorators(member) : (member.modifiers?.filter((m) => m.kind === ts.SyntaxKind.Decorator) as ts.Decorator[] | undefined)
        // console.log('decorators', decorators)
        if (!decorators || decorators.length === 0) return null
        for (const decorator of decorators) {
          const expr = decorator.expression
          // console.log('expr', expr)
          if (!ts.isCallExpression(expr)) continue
          // const keys_isIn = parse_isIn(expr)
          // console.log('parse_isIn---keys', keys_isIn)


          const keys_ApiProperty = parse_ApiProperty(expr)
          // console.log('parse_ApiProperty---keys', keys_ApiProperty)

        }
      }
    })
  })
}




function parse_ApiProperty(expr: ts.CallExpression) {
  const firstArg = expr.arguments[0]
  const funcName = ts.isIdentifier(expr?.expression) ? expr?.expression.text : null
  if (!(funcName === 'ApiProperty' && expr.arguments.length > 0)) return null
  if (!ts.isObjectLiteralExpression(firstArg)) return null
  let description: string | null = null
  let example: string | number | boolean | null = null
  firstArg.properties.forEach((prop) => {
    if (!ts.isPropertyAssignment(prop)) return
    const name = ts.isIdentifier(prop.name) ? prop.name.text : ts.isStringLiteral(prop.name) ? prop.name.text : null
    // 解析description
 
    // 解析example
    if (name === 'example') {
      example = prop.initializer.getText()
      if (ts.isNumericLiteral(prop.initializer)) example = Number(prop.initializer.text)
      if (ts.isStringLiteral(prop.initializer)) example = prop.initializer.text
      if (prop.initializer.kind === ts.SyntaxKind.TrueKeyword) example = true
      if (prop.initializer.kind === ts.SyntaxKind.FalseKeyword) example = false
      // console.log('parse_ApiProperty---example', example)

      
    }


    if (name === 'description') {
      description = prop.initializer.getText()
      // console.log('parse_ApiProperty---description', description)
    }
    console.log('parse_ApiProperty---name', { description, example })
    if (!name) return
  })
}


function parse_isIn(expr: ts.CallExpression): any[] | null {
  const funcName = ts.isIdentifier(expr?.expression) ? expr?.expression.text : null
  if (!(funcName === 'IsIn' && expr.arguments.length > 0)) return null
  const firstArg = expr.arguments[0]
  const keys: any[] = []
  ts.forEachChild(firstArg, (element) => {
    if (ts.isStringLiteral(element)) {
      keys.push(element.text)
    }
    if (ts.isNumericLiteral(element)) {
      keys.push(Number(element.getText()))
    }
  })
  return keys
}

