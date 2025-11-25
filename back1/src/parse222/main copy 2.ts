// main copy 3.ts
import * as ts from 'typescript'
import * as path from 'path'
import * as fs from 'fs'


// ==================== 读取文件 ====================
const list_path_file = [
    'D:/BBB/sys_store/back1/src/v1/auth/dto/login_base.ts',

]


// 读取文件 login_base.ts  ,login_base.ts中有引入info_file   (import { info_file } from './info_file'),我像获取所有文件


