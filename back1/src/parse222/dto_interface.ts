/**
 * @example
 * ```ts
 * let form={
 *  code:"123456",                                                                                       // [验证码]
 *  age:18,                                                                                              // [年龄]
 *  kind:"个人",                                                                                           // [分类]
 *  list_main_img:[{url:"https://www.baidu.com/img/flexible/logo/pc/result.png",file_name:"result.png"}] // [列表-主图]
 * }
 * ```
 */
export interface login_base {
  code: string;
  age: number;
  kind: "个人" | "企业" | "国企" | "私企";
  list_main_img: info_file[];
}

/**
 * @example
 * ```ts
 * let form={
 *  url:"https://www.baidu.com/img/flexible/logo/pc/result.png", // [url]
 *  file_name:"result.png"                                       // [文件名称]
 * }
 * ```
 */
export interface info_file {
  url: string;
  file_name: string;
}

