import { make_dto_list_flat } from './make_dto_list_flat'
import { make_dto_form } from './make_dto_form'
import { tool_list_import_file } from './tool_list_import_file'
import * as fs from 'fs'

const list_path_file = tool_list_import_file([
    'D:/BBB/sys_store/back1/src/v1/auth/dto/login_base.ts',
])
// console.log('关联的所有文件---list_path_file', list_path_file)

let dto_list_flat = make_dto_list_flat({ list_path_file})
// console.log('解析数据---dto_list_flat', JSON.stringify(dto_list_flat, null, 2))
fs.writeFileSync('D:/BBB/sys_store/back1/src/parse666/dto_list_flat.json', JSON.stringify(dto_list_flat, null, 2))



let str_form_all = make_dto_form({ dto_list_flat })
// console.log('接口字符串---str_all', str_all)
fs.writeFileSync('D:/BBB/sys_store/back1/src/parse666/dto_form_all.ts', str_form_all )