import { make_dto_obj } from './make_dto_obj'
import { make_dto_interface_1 } from './make_dto_interface_1'
import { tool_list_import_file } from './tool_list_import_file'

const list_path_file = tool_list_import_file([
    'D:/BBB/sys_store/back1/src/v1/auth/dto/login_base.ts',
])
// console.log('关联的所有文件---list_path_file', list_path_file)

let dto_obj = make_dto_obj({ list_path_file, path_file_write: 'D:/BBB/sys_store/back1/src/parse555/dto_obj.json' })
// console.log('解析后的数据---dto_obj', JSON.stringify(dto_obj, null, 2))


let str_all = make_dto_interface_1({ dto_obj, path_file_write: 'D:/BBB/sys_store/back1/src/parse555/dto_interface.ts' })
console.log('生成的字符串---str_all', str_all)