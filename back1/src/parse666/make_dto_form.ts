// const dto_list_flat = [
//     {
//         "class_name": "login_base",
//         "field": "code",
//         "description": "验证码",
//         "example": "123456",
//         "type": "string"
//     },
//     {
//         "class_name": "info_file",
//         "field": "age",
//         "description": "年龄",
//         "example": 18,
//         "type": "number"
//     },
//     {
//         "class_name": "login_base",
//         "field": "kind",
//         "description": "分类",
//         "example": "个人",
//         "isIn": {
//             "list": [
//                 "个人",
//                 "企业",
//                 "国企",
//                 "私企"
//             ],
//             "message": "分类:必须是-['个人', '企业','国企','私企']"
//         },
//         "type": "string"
//     },
//     {
//         "class_name": "login_base",
//         "field": "list_main_img",
//         "description": "列表-主图",
//         "type": "info_file[]"
//     },
//     {
//         "class_name": "info_file",
//         "field": "url",
//         "description": "url",
//         "example": "https://www.baidu.com/img/flexible/logo/pc/result.png",
//         "type": "string"
//     },
//     {
//         "class_name": "info_file",
//         "field": "file_name",
//         "description": "文件名称",
//         "example": "result.png",
//         "type": "string"
//     }
// ]

// make_dto_form({ dto_list_flat: dto_list_flat as any[] })
// ==================== 入口函数 ====================
export function make_dto_form({ dto_list_flat }: { dto_list_flat: string[] }) {
    const class_name_list = [...new Set(dto_list_flat.map((item: any) => item.class_name))];
    // console.log('class_name_list', class_name_list)
    let class_obj = {} as any
    let str_form_all = ''
    for (let i = 0; i < class_name_list.length; i++) {
        const class_name = class_name_list[i]
        if (!class_obj[class_name]) class_obj[class_name] = {}
        // console.log(`============ ${class_name} ==============`)
        const class_one = dto_list_flat.filter((item: any) => item.class_name === class_name);
        // console.log('class_one', class_one)
        let str_description = '\n/** \n* @example : \n* ```ts     \n* let class_name = {\n'.replace('class_name', class_name) //注解开头
        let str_code = 'export interface class_name {\n'.replace('class_name', class_name) //代码开头
        let str_dto = ''
        class_one.map((ele: any) => {
            // console.log("ele", ele)


            // ================= 注解-处理 =================
            if (ele.type === 'string') ele.example = `"${ele.example}"`
            let curr_description = `*   ${ele.field}: ${ele.example}  ,//${ele.description}\n`
            str_description += curr_description


            // ================= 代码-处理 =================
            // let curr_code = `  ${ele.field}: ${ele.type};     \n`
            // str_code += curr_code
            // 饰器@IsIn处理装(类似枚举)
            if (ele.isIn) {
                let curr_isIn = ''
                // 对ele.isIn.list数据进行处理,如果是字符串,则用"包裹
                if (ele.type === 'string') {
                    curr_isIn = ele.isIn.list = ele.isIn.list.map((item: any) => `"${item}"`).join(' | ')
                } else {
                    curr_isIn = ele.isIn.list.join(' | ')
                }
                let curr_code = `  ${ele.field}: ${curr_isIn};     \n`
                str_code += curr_code
            }
            // 常规字段处理
            else {
                let curr_code = `  ${ele.field}: ${ele.type};     \n`
                str_code += curr_code
            }
        })
        str_description = str_description + "* }``` */\n" //注解结尾
        str_code = str_code + "}" + "\n"   //代码结尾
        str_dto += str_description + str_code
        // console.log(`============ ${class_name} ==============`)
        // console.log('str_dto:', str_dto)
        str_form_all += str_dto
    }
    console.log(`============ 全部dto  ==============`)
    console.log('str_form_all:', str_form_all)
    return str_form_all
}