/**
* @example: ```ts
* let login_base={
*  code:123456,  //[验证码]  
*  age:18,  //[年龄]  
*  kind:个人,  //[分类]  
*  list_main_img:undefined,  //[列表-主图]  
*}
* ```
*/
/**
* @example: ```ts
* let login_base={
*  code:123456,  //[验证码]  
*  age:18,  //[年龄]  
*  kind:个人,  //[分类]  
*  list_main_img:undefined,  //[列表-主图]  
*}
* ```
*/
export  interface login_base {
 code: string;
 age: number;
 kind: "个人" | "企业" | "国企" | "私企";
 list_main_img: info_file[];
}

export  interface info_file {
 url: string;
 file_name: string;
}

